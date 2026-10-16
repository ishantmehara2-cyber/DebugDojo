import type { Challenge } from '../types/challenge'

export const challengesData: Challenge[] = [
  {
    id: 'last-k-total',
    title: 'Last K Total',
    difficulty: 'Easy',
    category: 'BOUNDARY LOGIC',
    duration: '8 min',
    learningObjective: 'Learn to reason about list boundaries when input length is smaller than expected slice size.',
    conceptTags: ['Lists', 'Indexing', 'Loops', 'Boundaries'],
    description:
      'Write a function `last_k_total(marks, k)` that returns the total sum of the last `k` items in `marks`.\n\n' +
      'Rules:\n' +
      '• If `k` is greater than the total number of items in `marks`, sum all available items.\n' +
      '• `marks` can be empty `[]`.\n' +
      '• `k >= 0`.\n\n' +
      'Identify why the starter code fails on small or boundary inputs.',
    functionName: 'last_k_total',
    starterCode:
      'def last_k_total(marks, k):\n' +
      '    # Total the last k marks\n' +
      '    total = 0\n' +
      '    start_index = len(marks) - k\n' +
      '    for i in range(start_index, len(marks)):\n' +
      '        total += marks[i]\n' +
      '    return total\n',
    solutionCode:
      'def last_k_total(marks, k):\n' +
      '    if not marks or k <= 0:\n' +
      '        return 0\n' +
      '    start_index = max(0, len(marks) - k)\n' +
      '    return sum(marks[start_index:])\n',
    visibleTests: [
      {
        id: 'v1',
        inputDesc: 'marks = [10, 20, 30, 40], k = 2',
        expectedOutput: '70',
        inputArgs: [[10, 20, 30, 40], 2],
      },
      {
        id: 'v2',
        inputDesc: 'marks = [15, 25, 35], k = 5',
        expectedOutput: '75',
        inputArgs: [[15, 25, 35], 5],
      },
      {
        id: 'v3',
        inputDesc: 'marks = [], k = 3',
        expectedOutput: '0',
        inputArgs: [[], 3],
      },
    ],
    hiddenTestCount: 5,
    hiddenTests: [
      { id: 'h1', name: 'k is exactly len(marks)', inputArgs: [[5, 10, 15], 3], expectedOutput: 30 },
      { id: 'h2', name: 'k is 0', inputArgs: [[10, 20], 0], expectedOutput: 0 },
      { id: 'h3', name: 'Single item list with large k', inputArgs: [[100], 10], expectedOutput: 100 },
      { id: 'h4', name: 'Empty list with k = 0', inputArgs: [[], 0], expectedOutput: 0 },
      { id: 'h5', name: 'All zeros in list', inputArgs: [[0, 0, 0], 2], expectedOutput: 0 },
    ],
    hints: [
      'Think about what happens to `len(marks) - k` when `k` is larger than `len(marks)`.',
      'Inspect the calculation of `start_index`. Can a negative start index lead to out-of-bounds or unexpected negative wrapping?',
      'Use `max(0, len(marks) - k)` or slicing `marks[-k:]` if `k > 0` to safely handle boundary cases.',
    ],
    explanation: {
      whatHappened: 'Your code calculates `start_index = len(marks) - k`. When `k` is greater than `len(marks)`, `start_index` becomes negative, causing unexpected loop boundaries or indexing errors.',
      whereToInvestigate: 'Look at how `start_index` is computed before the loop begins.',
      whyItMatters: 'Boundary conditions (like receiving fewer items than requested) are one of the most common sources of production crashes.',
      thinkAboutThis: 'If `marks` has 3 items and `k` is 5, what index will your loop start from if you do not clamp `start_index`?',
    },
    mistakeCategories: ['boundary_comparison', 'unhandled_short_input'],
    xpReward: 150,
  },
  {
    id: 'count-passes',
    title: 'Count Passes',
    difficulty: 'Easy',
    category: 'COMPARISONS & LOOPS',
    duration: '5 min',
    learningObjective: 'Master inclusive vs strict comparison operators in loop conditions.',
    conceptTags: ['Lists', 'Loops', 'Comparisons'],
    description:
      'Write a function `count_passes(marks)` that counts how many student marks are passing grade.\n\n' +
      'Rules:\n' +
      '• A passing mark is 40 or above (`>= 40`).\n' +
      '• Return the total count of passing marks.\n' +
      '• Input can be empty `[]`.',
    functionName: 'count_passes',
    starterCode:
      'def count_passes(marks):\n' +
      '    passes = 0\n' +
      '    for mark in marks:\n' +
      '        if mark > 40:\n' +
      '            passes += 1\n' +
      '    return passes\n',
    solutionCode:
      'def count_passes(marks):\n' +
      '    passes = 0\n' +
      '    for mark in marks:\n' +
      '        if mark >= 40:\n' +
      '            passes += 1\n' +
      '    return passes\n',
    visibleTests: [
      {
        id: 'v1',
        inputDesc: 'marks = [35, 40, 45, 50]',
        expectedOutput: '3',
        inputArgs: [[35, 40, 45, 50]],
      },
      {
        id: 'v2',
        inputDesc: 'marks = [10, 20, 39]',
        expectedOutput: '0',
        inputArgs: [[10, 20, 39]],
      },
      {
        id: 'v3',
        inputDesc: 'marks = [40, 40, 40]',
        expectedOutput: '3',
        inputArgs: [[40, 40, 40]],
      },
    ],
    hiddenTestCount: 4,
    hiddenTests: [
      { id: 'h1', name: 'Empty list', inputArgs: [[]], expectedOutput: 0 },
      { id: 'h2', name: 'All 100s', inputArgs: [[100, 100]], expectedOutput: 2 },
      { id: 'h3', name: 'Boundary 39 and 40', inputArgs: [[39, 40]], expectedOutput: 1 },
      { id: 'h4', name: 'Negative marks', inputArgs: [[-5, 40]], expectedOutput: 1 },
    ],
    hints: [
      'Is 40 considered a passing grade according to the problem description?',
      'Check the comparison operator inside your `if` statement.',
      'Change strict inequality `>` to inclusive inequality `>=`.',
    ],
    explanation: {
      whatHappened: 'The starter code uses `if mark > 40:`, which excludes students who scored exactly 40.',
      whereToInvestigate: 'Examine the `if` condition inside the `for` loop.',
      whyItMatters: 'Inclusive vs exclusive boundary logic (>= vs >) is a frequent cause of off-by-one errors in statistics and business logic.',
      thinkAboutThis: 'Does a student getting 40 pass or fail?',
    },
    mistakeCategories: ['off_by_one', 'boundary_comparison'],
    xpReward: 100,
  },
  {
    id: 'first-n-squares',
    title: 'First N Squares',
    difficulty: 'Easy',
    category: 'RANGE & LOOPS',
    duration: '6 min',
    learningObjective: 'Understand 0-indexed range defaults vs 1-indexed sequences.',
    conceptTags: ['Loops', 'Range', 'Return'],
    description:
      'Write a function `first_n_squares(n)` that returns a list containing the squares of the first `n` positive integers.\n\n' +
      'Example:\n' +
      '• `n = 3` → `[1, 4, 9]`\n' +
      '• `n = 0` → `[]`',
    functionName: 'first_n_squares',
    starterCode:
      'def first_n_squares(n):\n' +
      '    squares = []\n' +
      '    for i in range(n):\n' +
      '        squares.append(i * i)\n' +
      '    return squares\n',
    solutionCode:
      'def first_n_squares(n):\n' +
      '    squares = []\n' +
      '    for i in range(1, n + 1):\n' +
      '        squares.append(i * i)\n' +
      '    return squares\n',
    visibleTests: [
      {
        id: 'v1',
        inputDesc: 'n = 3',
        expectedOutput: '[1, 4, 9]',
        inputArgs: [3],
      },
      {
        id: 'v2',
        inputDesc: 'n = 1',
        expectedOutput: '[1]',
        inputArgs: [1],
      },
      {
        id: 'v3',
        inputDesc: 'n = 0',
        expectedOutput: '[]',
        inputArgs: [0],
      },
    ],
    hiddenTestCount: 4,
    hiddenTests: [
      { id: 'h1', name: 'n = 5', inputArgs: [5], expectedOutput: [1, 4, 9, 16, 25] },
      { id: 'h2', name: 'n = 2', inputArgs: [2], expectedOutput: [1, 4] },
      { id: 'h3', name: 'n = 0', inputArgs: [0], expectedOutput: [] },
      { id: 'h4', name: 'n = 10', inputArgs: [10], expectedOutput: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100] },
    ],
    hints: [
      'In Python, `range(n)` generates numbers from `0` to `n - 1`.',
      'Positive integers start from `1`, not `0`.',
      'Use `range(1, n + 1)` so `i` ranges from `1` to `n`.',
    ],
    explanation: {
      whatHappened: 'Your loop used `range(n)`, which produced `0, 1, 2` instead of `1, 2, 3`. This resulted in `[0, 1, 4]` instead of `[1, 4, 9]`.',
      whereToInvestigate: 'Check the start and end arguments passed to `range()`.',
      whyItMatters: 'Default zero-indexing in loops often leads to unexpected 0-values when generating sequence outputs.',
      thinkAboutThis: 'What is the square of 0, and should 0 be in the list of the first N positive squares?',
    },
    mistakeCategories: ['off_by_one'],
    xpReward: 120,
  },
  {
    id: 'middle-three',
    title: 'Middle Three Values',
    difficulty: 'Medium',
    category: 'SLICING & INDEXING',
    duration: '10 min',
    learningObjective: 'Master symmetrical slice indexing on odd-length lists.',
    conceptTags: ['Lists', 'Indexing', 'Boundaries'],
    description:
      'Write a function `middle_three(values)` that takes an odd-length list `values` and returns a list containing the middle three elements.\n\n' +
      'Rules:\n' +
      '• If `values` contains fewer than 3 elements, return `values` unchanged.\n' +
      '• Input list length will be odd when `len >= 3`.',
    functionName: 'middle_three',
    starterCode:
      'def middle_three(values):\n' +
      '    if len(values) < 3:\n' +
      '        return values\n' +
      '    mid = len(values) // 2\n' +
      '    return values[mid - 1 : mid + 1]\n',
    solutionCode:
      'def middle_three(values):\n' +
      '    if len(values) < 3:\n' +
      '        return values\n' +
      '    mid = len(values) // 2\n' +
      '    return values[mid - 1 : mid + 2]\n',
    visibleTests: [
      {
        id: 'v1',
        inputDesc: 'values = [10, 20, 30, 40, 50]',
        expectedOutput: '[20, 30, 40]',
        inputArgs: [[10, 20, 30, 40, 50]],
      },
      {
        id: 'v2',
        inputDesc: 'values = [1, 2, 3, 4, 5, 6, 7]',
        expectedOutput: '[3, 4, 5]',
        inputArgs: [[1, 2, 3, 4, 5, 6, 7]],
      },
      {
        id: 'v3',
        inputDesc: 'values = [99]',
        expectedOutput: '[99]',
        inputArgs: [[99]],
      },
    ],
    hiddenTestCount: 4,
    hiddenTests: [
      { id: 'h1', name: '3 items', inputArgs: [[1, 2, 3]], expectedOutput: [1, 2, 3] },
      { id: 'h2', name: '2 items', inputArgs: [[5, 10]], expectedOutput: [5, 10] },
      { id: 'h3', name: 'Empty list', inputArgs: [[]], expectedOutput: [] },
      { id: 'h4', name: '9 items', inputArgs: [[1, 2, 3, 4, 5, 6, 7, 8, 9]], expectedOutput: [4, 5, 6] },
    ],
    hints: [
      'In Python list slicing `list[start:stop]`, the `stop` index is exclusive.',
      'To include 3 elements starting at `mid - 1`, how many positions ahead should `stop` be?',
      'Change `mid + 1` to `mid + 2` because `(mid + 2) - (mid - 1) = 3`.',
    ],
    explanation: {
      whatHappened: 'The slice `values[mid - 1 : mid + 1]` only selected 2 items because the ending bound in Python slicing is non-inclusive.',
      whereToInvestigate: 'Examine the end index of your list slice.',
      whyItMatters: 'Exclusive upper bounds in slicing syntax are a classic trap in Python.',
      thinkAboutThis: 'If `mid = 2`, what elements does `values[1:3]` include?',
    },
    mistakeCategories: ['off_by_one', 'boundary_comparison'],
    xpReward: 180,
  },
  {
    id: 'sum-upto',
    title: 'Sum Up To N',
    difficulty: 'Easy',
    category: 'LOOP BOUNDARIES',
    duration: '5 min',
    learningObjective: 'Correct inclusive loop accumulation boundaries.',
    conceptTags: ['Loops', 'Accumulation', 'Range'],
    description:
      'Write a function `sum_upto(n)` that returns the sum of integers from 1 up to and including `n`.\n\n' +
      'Example: `sum_upto(4)` -> `1 + 2 + 3 + 4 = 10`.',
    functionName: 'sum_upto',
    starterCode:
      'def sum_upto(n):\n' +
      '    total = 0\n' +
      '    for i in range(1, n):\n' +
      '        total += i\n' +
      '    return total\n',
    solutionCode:
      'def sum_upto(n):\n' +
      '    total = 0\n' +
      '    for i in range(1, n + 1):\n' +
      '        total += i\n' +
      '    return total\n',
    visibleTests: [
      { id: 'v1', inputDesc: 'n = 4', expectedOutput: '10', inputArgs: [4] },
      { id: 'v2', inputDesc: 'n = 1', expectedOutput: '1', inputArgs: [1] },
      { id: 'v3', inputDesc: 'n = 5', expectedOutput: '15', inputArgs: [5] },
    ],
    hiddenTestCount: 3,
    hiddenTests: [
      { id: 'h1', name: 'n = 10', inputArgs: [10], expectedOutput: 55 },
      { id: 'h2', name: 'n = 0', inputArgs: [0], expectedOutput: 0 },
      { id: 'h3', name: 'n = 2', inputArgs: [2], expectedOutput: 3 },
    ],
    hints: [
      'In Python `range(a, b)`, `b` is excluded.',
      'If you pass `range(1, n)`, the loop stops at `n - 1`.',
      'Use `range(1, n + 1)`.',
    ],
    explanation: {
      whatHappened: 'The loop `range(1, n)` omitted `n` from the sum.',
      whereToInvestigate: 'Check the upper limit of `range()`.',
      whyItMatters: 'Excluding the last value is a top source of off-by-one errors.',
      thinkAboutThis: 'Does `range(1, 4)` include 4?',
    },
    mistakeCategories: ['off_by_one'],
    xpReward: 100,
  },
  {
    id: 'first-even',
    title: 'Find First Even Number',
    difficulty: 'Easy',
    category: 'EARLY RETURN',
    duration: '6 min',
    learningObjective: 'Differentiate between print statements and return values.',
    conceptTags: ['Functions', 'Return', 'Conditionals'],
    description:
      'Write a function `first_even(numbers)` that returns the first even number in `numbers`.\n\n' +
      'If no even number exists, return `None`.',
    functionName: 'first_even',
    starterCode:
      'def first_even(numbers):\n' +
      '    for num in numbers:\n' +
      '        if num % 2 == 0:\n' +
      '            print(num)\n' +
      '    return None\n',
    solutionCode:
      'def first_even(numbers):\n' +
      '    for num in numbers:\n' +
      '        if num % 2 == 0:\n' +
      '            return num\n' +
      '    return None\n',
    visibleTests: [
      { id: 'v1', inputDesc: 'numbers = [1, 3, 4, 6]', expectedOutput: '4', inputArgs: [[1, 3, 4, 6]] },
      { id: 'v2', inputDesc: 'numbers = [1, 3, 5]', expectedOutput: 'null', inputArgs: [[1, 3, 5]] },
      { id: 'v3', inputDesc: 'numbers = [8, 10]', expectedOutput: '8', inputArgs: [[8, 10]] },
    ],
    hiddenTestCount: 3,
    hiddenTests: [
      { id: 'h1', name: 'Empty list', inputArgs: [[]], expectedOutput: null },
      { id: 'h2', name: 'First item is even', inputArgs: [[2, 3, 5]], expectedOutput: 2 },
      { id: 'h3', name: 'Negative evens', inputArgs: [[-3, -4, 2]], expectedOutput: -4 },
    ],
    hints: [
      '`print()` outputs text to terminal console, but does not send a value back to the caller.',
      'Use `return num` as soon as you find an even number.',
      'Remove `print(num)` and replace it with `return num`.',
    ],
    explanation: {
      whatHappened: 'The function printed the number to stdout instead of returning it. Therefore, the function always returned `None`.',
      whereToInvestigate: 'Check where you emit the answer inside the loop.',
      whyItMatters: 'Confusing `print()` and `return` is a common pitfall when transitioning from scripting to functional modular code.',
      thinkAboutThis: 'Does `print()` allow other functions to use the result?',
    },
    mistakeCategories: ['print_not_return'],
    xpReward: 110,
  },
  {
    id: 'double-positives',
    title: 'Filter & Double Positives',
    difficulty: 'Easy',
    category: 'LIST MUTATION',
    duration: '7 min',
    learningObjective: 'Avoid modifying lists in-place when returning new transformed lists.',
    conceptTags: ['Lists', 'Transformation', 'Filtering'],
    description:
      'Write a function `double_positives(nums)` that returns a new list containing all positive numbers (`> 0`) multiplied by 2.\n\n' +
      'Do not modify the input list.',
    functionName: 'double_positives',
    starterCode:
      'def double_positives(nums):\n' +
      '    result = []\n' +
      '    for x in nums:\n' +
      '        if x > 0:\n' +
      '            result.append(x)\n' +
      '    # Missing doubling!\n' +
      '    return result\n',
    solutionCode:
      'def double_positives(nums):\n' +
      '    result = []\n' +
      '    for x in nums:\n' +
      '        if x > 0:\n' +
      '            result.append(x * 2)\n' +
      '    return result\n',
    visibleTests: [
      { id: 'v1', inputDesc: 'nums = [-2, 3, 0, 5]', expectedOutput: '[6, 10]', inputArgs: [[-2, 3, 0, 5]] },
      { id: 'v2', inputDesc: 'nums = [-1, -5]', expectedOutput: '[]', inputArgs: [[-1, -5]] },
      { id: 'v3', inputDesc: 'nums = [1, 2, 3]', expectedOutput: '[2, 4, 6]', inputArgs: [[1, 2, 3]] },
    ],
    hiddenTestCount: 3,
    hiddenTests: [
      { id: 'h1', name: 'Empty list', inputArgs: [[]], expectedOutput: [] },
      { id: 'h2', name: 'All zero', inputArgs: [[0, 0]], expectedOutput: [] },
      { id: 'h3', name: 'Single positive', inputArgs: [[10]], expectedOutput: [20] },
    ],
    hints: [
      'The code correctly filters positive numbers, but forgets to double them.',
      'When appending `x` to `result`, transform `x`.',
      'Use `result.append(x * 2)`.',
    ],
    explanation: {
      whatHappened: 'The function collected positive numbers into `result`, but forgot to multiply them by 2.',
      whereToInvestigate: 'Inspect what value is passed to `.append()`.',
      whyItMatters: 'Transformation steps must be explicitly applied when constructing new list outputs.',
      thinkAboutThis: 'Are you returning the original values or their doubled values?',
    },
    mistakeCategories: ['off_by_one'],
    xpReward: 120,
  },
  {
    id: 'reverse-words',
    title: 'Reverse Words in Sentence',
    difficulty: 'Medium',
    category: 'STRING MANIPULATION',
    duration: '8 min',
    learningObjective: 'Master string splitting, reversing, and joining.',
    conceptTags: ['Strings', 'Lists', 'Manipulation'],
    description:
      'Write a function `reverse_words(sentence)` that returns a string where each word in `sentence` is individually reversed, while keeping word order.',
    functionName: 'reverse_words',
    starterCode:
      'def reverse_words(sentence):\n' +
      '    words = sentence.split(" ")\n' +
      '    reversed_words = []\n' +
      '    for w in words:\n' +
      '        reversed_words.append(w)\n' +
      '    return " ".join(reversed_words)\n',
    solutionCode:
      'def reverse_words(sentence):\n' +
      '    words = sentence.split(" ")\n' +
      '    reversed_words = []\n' +
      '    for w in words:\n' +
      '        reversed_words.append(w[::-1])\n' +
      '    return " ".join(reversed_words)\n',
    visibleTests: [
      { id: 'v1', inputDesc: 'sentence = "debug dojo"', expectedOutput: '"gubed ojod"', inputArgs: ['debug dojo'] },
      { id: 'v2', inputDesc: 'sentence = "hello"', expectedOutput: '"olleh"', inputArgs: ['hello'] },
      { id: 'v3', inputDesc: 'sentence = "a b c"', expectedOutput: '"a b c"', inputArgs: ['a b c'] },
    ],
    hiddenTestCount: 3,
    hiddenTests: [
      { id: 'h1', name: 'Single char words', inputArgs: ['x y z'], expectedOutput: 'x y z' },
      { id: 'h2', name: 'Empty string', inputArgs: [''], expectedOutput: '' },
      { id: 'h3', name: 'Punctuation', inputArgs: ['cat! dog?'], expectedOutput: '!tac ?god' },
    ],
    hints: [
      'The code splits and joins words, but does not reverse each individual string `w`.',
      'In Python, you can reverse a string using `w[::-1]`.',
      'Append `w[::-1]` inside the loop.',
    ],
    explanation: {
      whatHappened: 'The words were split and recombined without reversing the characters inside each word.',
      whereToInvestigate: 'Check the value appended to `reversed_words`.',
      whyItMatters: 'Sub-element string slicing is essential for in-place word transformations.',
      thinkAboutThis: 'How do you reverse a string in Python using slicing?',
    },
    mistakeCategories: ['unhandled_short_input'],
    xpReward: 160,
  },
  {
    id: 'find-peak',
    title: 'Find Peak Element Index',
    difficulty: 'Medium',
    category: 'INDEX BOUNDARIES',
    duration: '10 min',
    learningObjective: 'Safely inspect adjacent elements without IndexError.',
    conceptTags: ['Indexing', 'Boundaries', 'Conditionals'],
    description:
      'Write a function `find_peak(arr)` that returns the index of the first element that is strictly greater than its neighbors.\n\n' +
      'If no peak exists or list has fewer than 3 elements, return `-1`.',
    functionName: 'find_peak',
    starterCode:
      'def find_peak(arr):\n' +
      '    for i in range(len(arr)):\n' +
      '        if arr[i] > arr[i-1] and arr[i] > arr[i+1]:\n' +
      '            return i\n' +
      '    return -1\n',
    solutionCode:
      'def find_peak(arr):\n' +
      '    if len(arr) < 3:\n' +
      '        return -1\n' +
      '    for i in range(1, len(arr) - 1):\n' +
      '        if arr[i] > arr[i-1] and arr[i] > arr[i+1]:\n' +
      '            return i\n' +
      '    return -1\n',
    visibleTests: [
      { id: 'v1', inputDesc: 'arr = [1, 3, 2, 1]', expectedOutput: '1', inputArgs: [[1, 3, 2, 1]] },
      { id: 'v2', inputDesc: 'arr = [1, 2, 3, 4]', expectedOutput: '-1', inputArgs: [[1, 2, 3, 4]] },
      { id: 'v3', inputDesc: 'arr = [1, 2]', expectedOutput: '-1', inputArgs: [[1, 2]] },
    ],
    hiddenTestCount: 4,
    hiddenTests: [
      { id: 'h1', name: 'Peak at index 2', inputArgs: [[1, 2, 5, 3, 1]], expectedOutput: 2 },
      { id: 'h2', name: 'Empty list', inputArgs: [[]], expectedOutput: -1 },
      { id: 'h3', name: 'All equal', inputArgs: [[3, 3, 3]], expectedOutput: -1 },
      { id: 'h4', name: 'Single item', inputArgs: [[10]], expectedOutput: -1 },
    ],
    hints: [
      'At index `i = 0`, `arr[i-1]` accesses `arr[-1]` (the end of list), and at index `i = len(arr)-1`, `arr[i+1]` goes out of bounds.',
      'Only check indices from `1` to `len(arr) - 2`.',
      'Use `range(1, len(arr) - 1)` after ensuring `len(arr) >= 3`.',
    ],
    explanation: {
      whatHappened: 'The loop checked `i = 0`, which compared `arr[0]` against `arr[-1]` (the last element) instead of ignoring outer edges.',
      whereToInvestigate: 'Check the range bounds for `i` when accessing `arr[i-1]` and `arr[i+1]`.',
      whyItMatters: 'Neighbor-checking loops must avoid edge indices to prevent out-of-bounds errors or wrapping bugs.',
      thinkAboutThis: 'What neighbor exists to the left of the very first element?',
    },
    mistakeCategories: ['boundary_comparison', 'unhandled_short_input'],
    xpReward: 180,
  },
  {
    id: 'flatten-pairs',
    title: 'Flatten 2D Pairs',
    difficulty: 'Medium',
    category: 'NESTED LOOPS',
    duration: '8 min',
    learningObjective: 'Iterate nested structures without overwriting accumulators.',
    conceptTags: ['Lists', 'Nested Loops', 'Flattening'],
    description:
      'Write a function `flatten_pairs(pairs)` that takes a list of 2-element lists and returns a single flattened 1D list.',
    functionName: 'flatten_pairs',
    starterCode:
      'def flatten_pairs(pairs):\n' +
      '    flat = []\n' +
      '    for pair in pairs:\n' +
      '        flat = pair\n' +
      '    return flat\n',
    solutionCode:
      'def flatten_pairs(pairs):\n' +
      '    flat = []\n' +
      '    for pair in pairs:\n' +
      '        for item in pair:\n' +
      '            flat.append(item)\n' +
      '    return flat\n',
    visibleTests: [
      { id: 'v1', inputDesc: 'pairs = [[1, 2], [3, 4]]', expectedOutput: '[1, 2, 3, 4]', inputArgs: [[[1, 2], [3, 4]]] },
      { id: 'v2', inputDesc: 'pairs = [[5, 6]]', expectedOutput: '[5, 6]', inputArgs: [[[5, 6]]] },
      { id: 'v3', inputDesc: 'pairs = []', expectedOutput: '[]', inputArgs: [[]] },
    ],
    hiddenTestCount: 3,
    hiddenTests: [
      { id: 'h1', name: 'Three pairs', inputArgs: [[[1, 2], [3, 4], [5, 6]]], expectedOutput: [1, 2, 3, 4, 5, 6] },
      { id: 'h2', name: 'Empty inner lists', inputArgs: [[[], []]], expectedOutput: [] },
      { id: 'h3', name: 'Zeros inside', inputArgs: [[[0, 0], [0, 1]]], expectedOutput: [0, 0, 0, 1] },
    ],
    hints: [
      'The line `flat = pair` overwrites `flat` instead of extending or appending items.',
      'Use an inner loop `for item in pair:` and append each `item` to `flat`.',
      'Or use `flat.extend(pair)`.',
    ],
    explanation: {
      whatHappened: 'The starter code re-assigned `flat = pair` in each iteration, leaving only the last pair.',
      whereToInvestigate: 'Examine the assignment inside the loop.',
      whyItMatters: 'Re-assigning accumulator variables inside loops is a common mistake when extending collections.',
      thinkAboutThis: 'Does `=` add to an existing list, or replace it entirely?',
    },
    mistakeCategories: ['off_by_one'],
    xpReward: 150,
  },
]
