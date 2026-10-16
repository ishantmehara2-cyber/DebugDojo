import type { TestCase, HiddenTest, TestResultItem } from '../types/challenge'

export interface EvaluationResult {
  visibleResults: TestResultItem[]
  hiddenPassedCount: number
  hiddenEvaluatedCount: number
  totalHiddenCount: number
  allPassed: boolean
  hasPrintNotReturn: boolean
  hasIndexError: boolean
  hasTypeError: boolean
  hasMutatedInput: boolean
  hasTimeout: boolean
  resourceLimitCategory?: 'memory_limit' | 'output_limit' | 'disk_limit'
  primaryError?: string
}

/**
 * Lightweight Python execution transpiler for browser sandbox evaluation.
 * Converts basic Python function syntax to JavaScript for instant test feedback.
 */
function transpilePythonToJs(pythonCode: string, functionName: string): string {
  const lines = pythonCode.split(/\r?\n/)
  const blocks: number[] = []
  const output: string[] = []

  const transformExpression = (source: string) => source
    .replace(/\bmax\s*\(/g, 'Math.max(')
    .replace(/\bmin\s*\(/g, 'Math.min(')
    .replace(/range\s*\(\s*([a-zA-Z_]\w*)\s*,\s*len\(\s*([a-zA-Z_]\w*)\s*\)\s*\)/g, 'Array.from({length: Math.max(0, ($2 ? $2.length : 0) - ($1))}, (_, i) => i + ($1))')
    .replace(/range\s*\(\s*len\(\s*([a-zA-Z_]\w*)\s*\)\s*\)/g, 'Array.from({length: ($1 ? $1.length : 0)}, (_, i) => i)')
    .replace(/range\s*\(\s*([a-zA-Z_]\w*)\s*,\s*len\(\s*([a-zA-Z_]\w*)\s*\)\s*-\s*(\d+)\s*\)/g, 'Array.from({length: Math.max(0, ($2 ? $2.length : 0) - ($3) - ($1))}, (_, i) => i + ($1))')
    .replace(/len\(([a-zA-Z_]\w*)\)\s*\/\/\s*(\d+)/g, 'Math.floor(($1 ? $1.length : 0) / $2)')
    .replace(/([a-zA-Z_]\w*|\d+)\s*\/\/\s*([a-zA-Z_]\w*|\d+)/g, 'Math.floor(($1) / ($2))')
    .replace(/len\(([^)]+)\)/g, '($1 ? $1.length : 0)')
    .replace(/sum\(([^)]+)\)/g, '($1 ? $1.reduce((a,b)=>a+b, 0) : 0)')
    .replace(/range\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, 'Array.from({length: Math.max(0, ($2) - ($1))}, (_, i) => i + ($1))')
    .replace(/range\s*\(\s*([^)]+)\s*\)/g, 'Array.from({length: Math.max(0, $1)}, (_, i) => i)')
    .replace(/([a-zA-Z0-9_]+)\[\s*:\s*:\s*-1\s*\]/g, '__pyReverse($1)')
    .replace(/([a-zA-Z0-9_]+)\[\s*-\s*([a-zA-Z0-9_]+)\s*:\s*\]/g, '$1.slice(-($2))')
    .replace(/([a-zA-Z0-9_]+)\[\s*:\s*([^\]]+)\s*\]/g, '$1.slice(0, $2)')
    .replace(/([a-zA-Z0-9_]+)\[\s*([^\]:]+)\s*:\s*([^\]]+)\s*\]/g, '$1.slice($2, $3)')
    .replace(/([a-zA-Z0-9_]+)\[\s*([^\]]+)\s*:\s*\]/g, '$1.slice($2)')
    .replace(/([a-zA-Z0-9_]+)\[\s*([^\]]+)\s*\]/g, '__pyIndex($1, $2)')
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g, 'null')
    .replace(/\band\b/g, '&&')
    .replace(/\bor\b/g, '||')
    .replace(/\bnot\b/g, '!')
    .replace(/\.append\(/g, '.push(')

  for (const rawLine of lines) {
    const withoutComment = rawLine.replace(/#.*$/, '')
    const trimmed = withoutComment.trim()
    if (!trimmed) continue

    const indent = (withoutComment.match(/^[ \t]*/)?.[0] ?? '').replace(/\t/g, '    ').length
    const isBranch = /^(elif\b|else\s*:)/.test(trimmed)
    if (!isBranch) {
      while (blocks.length > 0 && indent <= blocks[blocks.length - 1]) {
        output.push('}')
        blocks.pop()
      }
    }

    const defMatch = trimmed.match(/^def\s+([a-zA-Z0-9_]+)\s*\((.*)\)\s*:\s*$/)
    const forMatch = trimmed.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.+):\s*$/)
    const ifMatch = trimmed.match(/^if\s+(.+):\s*$/)
    const whileMatch = trimmed.match(/^while\s+(.+):\s*$/)
    const elifMatch = trimmed.match(/^elif\s+(.+):\s*$/)
    let transformed = trimmed

    if (defMatch) {
      transformed = `function ${defMatch[1]}(${transformExpression(defMatch[2])}) {`
      blocks.push(indent)
    } else if (forMatch) {
      transformed = `for (let ${forMatch[1]} of ${transformExpression(forMatch[2])}) {`
      blocks.push(indent)
    } else if (ifMatch) {
      transformed = `if (${transformExpression(ifMatch[1])}) {`
      blocks.push(indent)
    } else if (whileMatch) {
      transformed = `while (${transformExpression(whileMatch[1])}) {`
      blocks.push(indent)
    } else if (elifMatch) {
      transformed = `} else if (${transformExpression(elifMatch[1])}) {`
    } else if (/^else\s*:\s*$/.test(trimmed)) {
      transformed = '} else {'
    } else if (trimmed === 'pass') {
      transformed = ';'
    } else {
      transformed = transformExpression(trimmed)
    }

    output.push(transformed)
  }

  while (blocks.length > 0) {
    output.push('}')
    blocks.pop()
  }
  output.push(`return typeof ${functionName} === 'function' ? ${functionName} : null;`)
  return output.join('\n')
}

function findIndentationIssue(code: string): string | null {
  const hasMalformedHeader = code.split(/\r?\n/).some((line) => {
    const content = line.replace(/#.*$/, '').trim()
    return /^(?:def|if|elif|for|while|class)\b/.test(content) && !/:\s*$/.test(content)
  })
  if (hasMalformedHeader) {
    return null
  }

  const lines = code.split(/\r?\n/)
    .map((raw) => {
      const source = raw.replace(/#.*$/, '')
      const content = source.trim()
      const prefix = source.match(/^[ \t]*/)?.[0] ?? ''
      return {
        content,
        indent: prefix.replace(/\t/g, '    ').length,
        mixedIndent: prefix.includes('\t') && prefix.includes(' '),
        opensBlock: /:\s*$/.test(content),
      }
    })
    .filter((line) => line.content)

  const allowedIndentLevels = new Set([0])
  for (let index = 0; index < lines.length; index += 1) {
    const current = lines[index]
    const previous = lines[index - 1]
    if (current.mixedIndent) return 'Indentation Error: mixed tabs and spaces.'
    if (previous) {
      if (previous.opensBlock && current.indent <= previous.indent) {
        return 'Indentation Error: expected an indented block.'
      }
      if (current.indent > previous.indent) {
        if (!previous.opensBlock) return 'Indentation Error: unexpected indentation.'
        allowedIndentLevels.add(current.indent)
      } else if (current.indent < previous.indent && !allowedIndentLevels.has(current.indent)) {
        return 'Indentation Error: inconsistent indentation level.'
      }
    } else if (current.indent > 0) {
      return 'Indentation Error: unexpected indentation at the start of the submission.'
    }
  }
  if (lines.at(-1)?.opensBlock) return 'Indentation Error: expected an indented block.'
  return null
}

export function runPythonChallenge(
  code: string,
  functionName: string,
  visibleTests: TestCase[],
  hiddenTests: HiddenTest[],
  timeoutMs = 3000,
): Promise<EvaluationResult> {
  const hasPrintNotReturn = /\bprint\s*\(/.test(code) && !/\breturn\b/.test(code)
  const indentationIssue = findIndentationIssue(code)
  if (indentationIssue) {
    return Promise.resolve({
      visibleResults: visibleTests.map((test) => ({
        id: test.id,
        inputDesc: test.inputDesc,
        expectedOutput: test.expectedOutput,
        actualOutput: 'Error',
        status: 'RUNTIME ERROR',
        error: 'Indentation issue detected.',
      })),
      hiddenPassedCount: 0,
      hiddenEvaluatedCount: 0,
      totalHiddenCount: hiddenTests.length,
      allPassed: false,
      hasPrintNotReturn,
      hasIndexError: false,
      hasTypeError: false,
      hasMutatedInput: false,
      hasTimeout: false,
      primaryError: indentationIssue,
    })
  }
  const jsCode = transpilePythonToJs(code, functionName)
  const workerSource = `
    self.onmessage = function(event) {
      const { jsCode, functionName, visibleTests, hiddenTests, hasPrintNotReturn } = event.data;
      const send = self.postMessage.bind(self);
      self.postMessage = function() {};
      self.print = function() {};
      self.__pyIndex = function(value, index) {
        const position = Number(index);
        return value[position < 0 ? value.length + position : position];
      };
      self.__pyReverse = function(value) {
        return typeof value === 'string' ? Array.from(value).reverse().join('') : Array.from(value).reverse();
      };
      let compiledFn;
      try {
        compiledFn = new Function(jsCode)();
      } catch (error) {
        const message = String(error && error.message || error).slice(0, 500);
        send({ kind: 'compile-error', message });
        return;
      }
      if (typeof compiledFn !== 'function') {
        send({ kind: 'compile-error', message: 'The expected function could not be found.' });
        return;
      }

      const visibleResults = [];
      let hasIndexError = false;
      let hasTypeError = false;
      let hasMutatedInput = false;
      for (let index = 0; index < visibleTests.length; index += 1) {
        const test = visibleTests[index];
        try {
          const args = JSON.parse(JSON.stringify(test.inputArgs));
          const originalArgs = JSON.stringify(args);
          const result = compiledFn(...args);
          if (JSON.stringify(args) !== originalArgs) hasMutatedInput = true;
          const actualOutput = JSON.stringify(result) ?? 'None';
          if (actualOutput.length > 12000) {
            send({ kind: 'resource-limit', limit: 'output_limit', visibleResults });
            return;
          }
          const expectedOutput = test.expectedOutput.trim();
          const item = {
            id: test.id,
            inputDesc: test.inputDesc,
            expectedOutput: test.expectedOutput,
            actualOutput,
            status: actualOutput === expectedOutput || String(result) === expectedOutput ? 'PASS' : 'WRONG OUTPUT',
          };
          visibleResults.push(item);
          send({ kind: 'visible-progress', item });
        } catch (error) {
          const message = String(error && error.message || error).slice(0, 500);
          if (/undefined|bounds|index/i.test(message)) hasIndexError = true;
          if (/type|not a function/i.test(message)) hasTypeError = true;
          const item = {
            id: test.id,
            inputDesc: test.inputDesc,
            expectedOutput: test.expectedOutput,
            actualOutput: 'Error',
            status: 'RUNTIME ERROR',
            error: message,
          };
          visibleResults.push(item);
          send({ kind: 'visible-progress', item });
        }
      }

      let hiddenPassedCount = 0;
      let hiddenEvaluatedCount = 0;
      for (const test of hiddenTests) {
        try {
          const args = JSON.parse(JSON.stringify(test.inputArgs));
          const result = compiledFn(...args);
          const actual = JSON.stringify(result);
          if (actual !== undefined && actual.length > 12000) {
            send({ kind: 'resource-limit', limit: 'output_limit', visibleResults, hiddenPassedCount, hiddenEvaluatedCount });
            return;
          }
          if (actual === JSON.stringify(test.expectedOutput) || String(result) === String(test.expectedOutput)) {
            hiddenPassedCount += 1;
          }
        } catch {
          // Hidden exception details are intentionally never returned.
        }
        hiddenEvaluatedCount += 1;
        send({ kind: 'hidden-progress', hiddenPassedCount, hiddenEvaluatedCount });
      }
      send({
        kind: 'complete',
        visibleResults,
        hiddenPassedCount,
        hiddenEvaluatedCount,
        hasIndexError,
        hasTypeError,
        hasMutatedInput,
        hasPrintNotReturn,
      });
    };
  `

  return new Promise((resolve, reject) => {
    let worker: Worker
    let workerUrl: string
    try {
      workerUrl = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }))
      worker = new Worker(workerUrl)
    } catch (error) {
      reject(error)
      return
    }

    const visibleProgress = new Map<string, TestResultItem>()
    let hiddenProgress = 0
    let hiddenEvaluatedProgress = 0
    let settled = false
    const finish = (result: EvaluationResult) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      worker.terminate()
      URL.revokeObjectURL(workerUrl)
      resolve(result)
    }

    const baseResult = (
      visibleResults: TestResultItem[],
      hiddenPassedCount: number,
      fields: Partial<EvaluationResult> = {},
    ): EvaluationResult => ({
      visibleResults,
      hiddenPassedCount,
      hiddenEvaluatedCount: hiddenEvaluatedProgress,
      totalHiddenCount: hiddenTests.length,
      allPassed:
        visibleResults.length === visibleTests.length &&
        visibleResults.every((item) => item.status === 'PASS') &&
        hiddenPassedCount === hiddenTests.length &&
        !fields.hasTimeout &&
        !fields.resourceLimitCategory,
      hasPrintNotReturn,
      hasIndexError: false,
      hasTypeError: false,
      hasMutatedInput: false,
      hasTimeout: false,
      ...fields,
    })

    const timeout = window.setTimeout(() => {
      const visibleResults = visibleTests.map((test) =>
        visibleProgress.get(test.id) ?? {
          id: test.id,
          inputDesc: test.inputDesc,
          expectedOutput: test.expectedOutput,
          actualOutput: 'Not completed',
          status: 'TIMEOUT' as const,
        }
      )
      finish(baseResult(visibleResults, hiddenProgress, {
        hasTimeout: true,
        hiddenEvaluatedCount: hiddenEvaluatedProgress,
      }))
    }, timeoutMs)

    worker.onmessage = (event: MessageEvent) => {
      const payload = event.data as {
        kind: string
        item?: TestResultItem
        visibleResults?: TestResultItem[]
        hiddenPassedCount?: number
        hiddenEvaluatedCount?: number
        hasIndexError?: boolean
        hasTypeError?: boolean
        hasMutatedInput?: boolean
        message?: string
        limit?: EvaluationResult['resourceLimitCategory']
      }

      if (payload.kind === 'visible-progress' && payload.item) {
        visibleProgress.set(payload.item.id, payload.item)
      } else if (payload.kind === 'compile-error') {
        const visibleResults = visibleTests.map((test) => ({
          id: test.id,
          inputDesc: test.inputDesc,
          expectedOutput: test.expectedOutput,
          actualOutput: 'Error',
          status: 'RUNTIME ERROR' as const,
          error: payload.message,
        }))
        finish(baseResult(visibleResults, 0, { primaryError: payload.message }))
      } else if (payload.kind === 'resource-limit') {
        const completedVisible = new Map(
          (payload.visibleResults ?? [...visibleProgress.values()]).map((item) => [item.id, item]),
        )
        const visibleResults = visibleTests.map((test) => completedVisible.get(test.id) ?? {
          id: test.id,
          inputDesc: test.inputDesc,
          expectedOutput: test.expectedOutput,
          actualOutput: 'Resource limit',
          status: 'RESOURCE LIMIT' as const,
        })
        finish(
          baseResult(visibleResults, payload.hiddenPassedCount ?? hiddenProgress, {
            resourceLimitCategory: payload.limit ?? 'output_limit',
            hiddenEvaluatedCount: payload.hiddenEvaluatedCount ?? hiddenEvaluatedProgress,
          }),
        )
      } else if (payload.kind === 'hidden-progress') {
        hiddenProgress = payload.hiddenPassedCount ?? hiddenProgress
        hiddenEvaluatedProgress = payload.hiddenEvaluatedCount ?? hiddenEvaluatedProgress
      } else if (payload.kind === 'complete') {
        finish(
          baseResult(payload.visibleResults ?? [], payload.hiddenPassedCount ?? 0, {
            hasIndexError: Boolean(payload.hasIndexError),
            hasTypeError: Boolean(payload.hasTypeError),
            hasMutatedInput: Boolean(payload.hasMutatedInput),
            hiddenEvaluatedCount: payload.hiddenEvaluatedCount ?? hiddenTests.length,
          }),
        )
      }
    }

    worker.onerror = (event) => {
      event.preventDefault()
      const memoryLimit = /memory|allocation/i.test(event.message)
      finish(
        baseResult(
          visibleTests.map((test) => ({
            id: test.id,
            inputDesc: test.inputDesc,
            expectedOutput: test.expectedOutput,
            actualOutput: 'Error',
            status: memoryLimit ? 'RESOURCE LIMIT' : 'RUNTIME ERROR',
          })),
          hiddenProgress,
          memoryLimit
            ? {
                resourceLimitCategory: 'memory_limit',
                hiddenEvaluatedCount: hiddenEvaluatedProgress,
              }
            : {
                primaryError: 'The isolated execution worker stopped unexpectedly.',
                hiddenEvaluatedCount: hiddenEvaluatedProgress,
              },
        ),
      )
    }

    worker.postMessage({ jsCode, functionName, visibleTests, hiddenTests, hasPrintNotReturn })
  })
}
