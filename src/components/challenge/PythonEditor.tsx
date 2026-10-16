import Editor from '@monaco-editor/react'
import { Play, RotateCcw } from 'lucide-react'
import { useCallback } from 'react'

interface PythonEditorProps {
  code: string
  onChange: (value: string) => void
  onRun: () => void
  onReset: () => void
  isRunning?: boolean
}

export function PythonEditor({
  code,
  onChange,
  onRun,
  onReset,
  isRunning = false,
}: PythonEditorProps) {
  const handleEditorMount = useCallback(
    (editor: any, monaco: any) => {
      // Shortcut: Ctrl/Cmd + Enter executes code
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onRun()
      })
    },
    [onRun]
  )

  return (
    <div className="python-editor-panel" id="monaco-editor-section">
      {/* Editor Top Bar */}
      <div className="editor-topbar">
        <div className="editor-lang-indicator">
          <span className="python-dot" />
          <span>PYTHON</span>
          <span className="shortcut-hint">(Ctrl + Enter)</span>
        </div>

        <div className="editor-actions">
          <button
            type="button"
            className="button button--ghost button--sm"
            onClick={onReset}
            title="Reset code to starter template"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            className="button button--primary button--md editor-run-btn"
            onClick={onRun}
            disabled={isRunning}
          >
            <Play size={14} />
            <span>{isRunning ? 'RUNNING TESTS...' : 'RUN TESTS →'}</span>
          </button>
        </div>
      </div>

      {/* Monaco Surface */}
      <div className="editor-monaco-surface">
        <Editor
          height="480px"
          defaultLanguage="python"
          language="python"
          theme="vs-dark"
          value={code}
          onChange={(val) => onChange(val ?? '')}
          onMount={handleEditorMount}
          options={{
            fontSize: 14,
            fontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 14, bottom: 14 },
            tabSize: 4,
            insertSpaces: true,
            cursorBlinking: 'smooth',
            renderLineHighlight: 'line',
          }}
        />
      </div>
    </div>
  )
}
