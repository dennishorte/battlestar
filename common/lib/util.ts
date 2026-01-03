// Point type definition
interface Point {
  x: number
  y: number
}

// Event type for offsetPoint
interface OffsetEvent {
  offsetX: number
  offsetY: number
}

// Type for random number generator function
type RngFunction = () => number

// Type for key function that can return a single key or array of keys
type KeyFunction<T> = (elem: T) => string | number | (string | number)[] | null

// Type for value transformation function
type ValueFunction<T, V> = (elem: T) => V

// Type for predicate function
type Predicate<T> = (elem: T) => boolean

// Type for mapping function
type MapFunction<T, R> = (elem: T, index?: number, array?: T[]) => R

// Type for comparison function
type CompareFunction<T> = (a: T, b: T) => number

// Type for dictionary map function
type DictMapFunction<K, V, OK, OV> = (key: K, value: V) => [OK, OV]

const Util = {
  array: {},
  dict: {},
  event: {},
  point: {},
} as {
  array: {
    chunk: <T>(array: T[], size: number) => T[][]
    collect: <T, V = T>(
      elems: T[],
      keyFunc: KeyFunction<T>,
      valueFunc?: ValueFunction<T, V>
    ) => Record<string | number, V[]>
    countBy: <T>(array: T[], fn: (elem: T) => string | number) => Record<string | number, number>
    distinct: <T>(array: T[] | null | undefined, keyFunc?: (elem: T) => string | number) => T[]
    elementsEqual: <T>(a: T[], b: T[]) => boolean
    fill: <T>(count: number, value: T) => T[]
    intersection: <T>(array1: T[], array2: T[]) => T[]
    isDistinct: <T>(array: T[]) => boolean
    groupBy: <T>(array: T[], fn: MapFunction<T, string | number>) => Record<string | number, T[]>
    last: <T>(array: T[]) => T
    pairs: <T>(array: T[]) => [T, T][]
    pushUnique: <T>(array: T[], value: T) => void
    remove: <T>(array: T[], elem: T) => void
    removeByPredicate: <T>(array: T[], pred: Predicate<T>) => void
    reverseIter: <T>(array: T[]) => Generator<T>
    select: <T>(array: T[], rng?: RngFunction) => T
    selectMany: <T>(array: T[], count: number, rng?: RngFunction) => T[]
    shuffle: <T>(array: T[], rng?: RngFunction) => T[]
    swap: <T>(array: T[], i: number, j: number) => void
    takeRightWhile: <T>(array: T[], predicate: Predicate<T>) => T[]
    takeWhile: <T>(array: T[], predicate: Predicate<T>) => T[]
    toDict: <T>(
      array: T[],
      keyFn: string | ((obj: T) => string | number | null | undefined)
    ) => Record<string | number, T>
    uniqueMaxBy: <T>(array: T[], pred: (elem: T) => number) => T | undefined
  }
  dict: {
    strictEquals: (a: any, b: any) => boolean
    map: <K extends string | number, V, OK extends string | number, OV>(
      dict: Record<K, V>,
      func: DictMapFunction<K, V, OK, OV>
    ) => Record<OK, OV>
    compare: (obj1: any, obj2: any, path?: string) => string[]
    displayDifferences: (obj1: any, obj2: any) => boolean
  }
  event: {
    offsetPoint: (event: OffsetEvent) => Point
  }
  point: {
    add: (a: Point, b: Point) => Point
    sub: (a: Point, b: Point) => Point
  }
  assert: (test: any, message: string) => void
  ensure: <T extends Record<string, any>, K extends keyof T>(
    obj: T,
    prop: K,
    defaultValue: T[K]
  ) => T
  getAsArray: <T>(object: Record<string, T | T[]>, key: string) => T[]
  hasOwn: (obj: any, prop: string | number | symbol) => boolean
  inherit: (parent: new (...args: any[]) => any, child: new (...args: any[]) => any) => void
  isDigit: (str: string) => boolean
  isDigits: (str: string) => boolean
  range: (...args: number[]) => number[]
  stringReverse: (str: string) => string
  toCamelCase: (str: string) => string
  toCapsCase: (str: string) => string
  toKebabCase: (str: string) => string
  toPlainCase: (str: string) => string
  toTitleCase: (str: string) => string
  toSnakeCase: (str: string) => string
  deepcopy: <T>(obj: T) => T
}

////////////////////////////////////////////////////////////////////////////////
// Array functions

Util.array.chunk = function<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Groups array elements by keys and collects them into an object.
 *
 * @param elems - The array of elements to process
 * @param keyFunc - Function that returns a key or array of keys for each element
 * @param valueFunc - Optional function to transform each element before collection
 * @returns An object where keys are the results of keyFunc and values are arrays of
 *          (transformed) elements that correspond to each key
 */
Util.array.collect = function<T, V = T>(
  elems: T[],
  keyFunc: KeyFunction<T>,
  valueFunc: ValueFunction<T, V> = (elem: T) => elem as unknown as V
): Record<string | number, V[]> {
  const output: Record<string | number, V[]> = {}

  if (!Array.isArray(elems) || elems.length === 0) {
    return output
  }

  for (const elem of elems) {
    // Normalize keys to always be an array
    const keyResult = keyFunc(elem)
    const keys = Array.isArray(keyResult) ? keyResult : (keyResult === null ? [] : [keyResult])

    for (const key of keys) {
      if (key === null) {
        continue
      }

      if (!(key in output)) {
        output[key] = []
      }

      output[key].push(valueFunc(elem))
    }
  }

  return output
}

Util.array.countBy = function<T>(
  array: T[],
  fn: (elem: T) => string | number
): Record<string | number, number> {
  return array.reduce((counts, elem) => {
    const key = fn(elem)
    counts[key] = (counts[key] || 0) + 1
    return counts
  }, {} as Record<string | number, number>)
}

/**
 * Returns an array of distinct elements based on the key function.
 * If multiple elements have the same key, only the first one is kept.
 *
 * @param array - The array to process
 * @param keyFunc - Function to extract the key for comparison
 * @returns Array with duplicate elements removed
 */
Util.array.distinct = function<T>(
  array: T[] | null | undefined,
  keyFunc: (elem: T) => string | number = (elem: T) => elem as unknown as string | number
): T[] {
  if (!array || array.length === 0) {
    return []
  }

  const seen = new Set<string | number>()
  const result: T[] = []

  for (const item of array) {
    const key = keyFunc(item)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }

  return result
}

Util.array.elementsEqual = function<T>(a: T[], b: T[]): boolean {
  return (
    a.length === b.length
    && a.every((elem, index) => elem === b[index])
  )
}

Util.array.fill = function<T>(count: number, value: T): T[] {
  const output: T[] = []
  for (let i = 0; i < count; i++) {
    output.push(value)
  }
  return output
}

Util.array.intersection = function<T>(array1: T[], array2: T[]): T[] {
  return array1.filter(x => array2.includes(x))
}

Util.array.isDistinct = function<T>(array: T[]): boolean {
  return array.length === Util.array.distinct(array).length
}

Util.array.groupBy = function<T>(
  array: T[],
  fn: MapFunction<T, string | number>
): Record<string | number, T[]> {
  const groups: Record<string | number, T[]> = {}
  for (let i = 0; i < array.length; i++) {
    const key = fn(array[i], i, array)
    if (!Util.hasOwn(groups, key)) {
      groups[key] = []
    }

    groups[key].push(array[i])
  }
  return groups
}

Util.array.last = function<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error('Cannot call last on empty array')
  }
  return array[array.length - 1]
}

Util.array.pairs = function<T>(array: T[]): [T, T][] {
  return array.flatMap(
    (v, i) => array.slice(i+1).map(w => [v, w] as [T, T])
  )
}

Util.array.pushUnique = function<T>(array: T[], value: T): void {
  if (array.indexOf(value) === -1) {
    array.push(value)
  }
}

Util.array.remove = function<T>(array: T[], elem: T): void {
  const index = array.indexOf(elem)
  if (index !== -1) {
    array.splice(index, 1)
  }
}

Util.array.removeByPredicate = function<T>(array: T[], pred: Predicate<T>): void {
  const index = array.findIndex(x => pred(x))
  if (index !== -1) {
    array.splice(index, 1)
  }
}

Util.array.reverseIter = function*<T>(array: T[]): Generator<T> {
  let i = array.length
  while (i > 0) {
    i -= 1
    yield array[i]
  }
}

Util.array.select = function<T>(array: T[], rng?: RngFunction): T {
  if (!rng) {
    rng = Math.random
  }

  const index = Math.floor(rng() * array.length)
  return array[index]
}

Util.array.selectMany = function<T>(array: T[], count: number, rng?: RngFunction): T[] {
  return Util.array.shuffle([...array], rng).slice(0, count)
}

Util.array.shuffle = function<T>(array: T[], rng?: RngFunction): T[] {
  if (!rng) {
    rng = Math.random
  }

  let currentIndex = array.length
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(rng() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}

Util.array.swap = function<T>(array: T[], i: number, j: number): void {
  const tmp = array[i]
  array[i] = array[j]
  array[j] = tmp
}

Util.array.takeRightWhile = function<T>(array: T[], predicate: Predicate<T>): T[] {
  const accumulator: T[] = []
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) {
      accumulator.push(array[i])
    }
    else {
      break
    }
  }
  return accumulator.reverse()
}

Util.array.takeWhile = function<T>(array: T[], predicate: Predicate<T>): T[] {
  const accumulator: T[] = []
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      accumulator.push(array[i])
    }
    else {
      break
    }
  }
  return accumulator
}

/**
 * Converts an array of objects into a dictionary mapping keys to objects
 *
 * @param array - Array of objects to convert
 * @param keyFn - Function to extract key or property name to use as key
 * @returns Dictionary mapping keys to objects
 */
Util.array.toDict = function<T>(
  array: T[],
  keyFn: string | ((obj: T) => string | number | null | undefined)
): Record<string | number, T> {
  const keyFunc = typeof keyFn === 'string'
    ? (obj: T) => (obj as Record<string, any>)[keyFn] as string | number | null | undefined
    : keyFn

  const result: Record<string | number, T> = {}

  for (const item of array) {
    const key = keyFunc(item)
    if (key != null) {
      result[key] = item
    }
  }

  return result
}

Util.array.uniqueMaxBy = function<T>(array: T[], pred: (elem: T) => number): T | undefined {
  if (array.length === 0) {
    return undefined
  }

  if (array.length === 1) {
    return array[0]
  }

  const arrayCopy = [...array].sort((l, r) => pred(r) - pred(l))

  if (pred(arrayCopy[0]) > pred(arrayCopy[1])) {
    return arrayCopy[0]
  }
  else {
    return undefined
  }
}


////////////////////////////////////////////////////////////////////////////////
// Dict functions

Util.dict.strictEquals = function(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

Util.dict.map = function<K extends string | number, V, OK extends string | number, OV>(
  dict: Record<K, V>,
  func: DictMapFunction<K, V, OK, OV>
): Record<OK, OV> {
  const output: Record<OK, OV> = {} as Record<OK, OV>
  for (const [key, value] of Object.entries(dict)) {
    const [okey, ovalue] = func(key as K, value as V)
    output[okey] = ovalue
  }
  return output
}

Util.dict.compare = function(obj1: any, obj2: any, path: string = ''): string[] {
  // Initialize an array to store differences
  const differences: string[] = []

  // Get all keys from both objects
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)])

  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key

    // Check if key exists in both objects
    if (!(key in obj1)) {
      differences.push(`Key "${currentPath}" only exists in second object with value: ${JSON.stringify(obj2[key])}`)
      continue
    }

    if (!(key in obj2)) {
      differences.push(`Key "${currentPath}" only exists in first object with value: ${JSON.stringify(obj1[key])}`)
      continue
    }

    const val1 = obj1[key]
    const val2 = obj2[key]

    // Compare types
    if (typeof val1 !== typeof val2) {
      differences.push(`Type mismatch at "${currentPath}": ${typeof val1} vs ${typeof val2}`)
      continue
    }

    // Handle null values
    if (val1 === null && val2 === null) {
      continue
    }
    else if (val1 === null || val2 === null) {
      differences.push(`Value mismatch at "${currentPath}": ${JSON.stringify(val1)} vs ${JSON.stringify(val2)}`)
      continue
    }

    // If both values are objects or arrays
    if (typeof val1 === 'object') {
      // Check if one is array and the other is not
      if (Array.isArray(val1) !== Array.isArray(val2)) {
        differences.push(`Type mismatch at "${currentPath}": ${Array.isArray(val1) ? 'array' : 'object'} vs ${Array.isArray(val2) ? 'array' : 'object'}`)
        continue
      }

      // If both are arrays
      if (Array.isArray(val1)) {
        // Check array lengths
        if (val1.length !== val2.length) {
          differences.push(`Array length mismatch at "${currentPath}": ${val1.length} vs ${val2.length}`)
        }

        // Compare array elements
        const maxLength = Math.max(val1.length, val2.length)
        for (let i = 0; i < maxLength; i++) {
          if (i >= val1.length) {
            differences.push(`Extra element at "${currentPath}[${i}]" in second array: ${JSON.stringify(val2[i])}`)
          }
          else if (i >= val2.length) {
            differences.push(`Extra element at "${currentPath}[${i}]" in first array: ${JSON.stringify(val1[i])}`)
          }
          else if (typeof val1[i] === 'object' && val1[i] !== null && typeof val2[i] === 'object' && val2[i] !== null) {
            // Recursively compare objects in arrays
            differences.push(...Util.dict.compare(val1[i], val2[i], `${currentPath}[${i}]`))
          }
          else if (JSON.stringify(val1[i]) !== JSON.stringify(val2[i])) {
            differences.push(`Value mismatch at "${currentPath}[${i}]": ${JSON.stringify(val1[i])} vs ${JSON.stringify(val2[i])}`)
          }
        }
      }
      else {
        // Recursively compare objects
        differences.push(...Util.dict.compare(val1, val2, currentPath))
      }
    }
    else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
      // For primitive values, compare stringified values
      differences.push(`Value mismatch at "${currentPath}": ${JSON.stringify(val1)} vs ${JSON.stringify(val2)}`)
    }
  }

  return differences
}

// Function to display differences in a readable format
Util.dict.displayDifferences = function(obj1: any, obj2: any): boolean {
  const differences = Util.dict.compare(obj1, obj2)

  if (differences.length === 0) {
    console.log("Objects are identical")
    return true
  }
  else {
    console.log("Found the following differences:")
    differences.forEach((diff, index) => {
      console.log(`${index + 1}. ${diff}`)
    })
    return false
  }
}


////////////////////////////////////////////////////////////////////////////////
// Event Functions

Util.event.offsetPoint = function(event: OffsetEvent): Point {
  return {
    x: event.offsetX,
    y: event.offsetY,
  }
}


////////////////////////////////////////////////////////////////////////////////
// Point Functions

Util.point.add = function(a: Point, b: Point): Point {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  }
}

Util.point.sub = function(a: Point, b: Point): Point {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  }
}


////////////////////////////////////////////////////////////////////////////////
// Miscellaneous

Util.assert = function(test: any, message: string): void {
  if (!test) {
    throw new Error(message)
  }
}

Util.ensure = function<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  prop: K,
  defaultValue: T[K]
): T {
  if (!Util.hasOwn(obj, prop)) {
    obj[prop] = defaultValue
  }
  return obj
}

Util.getAsArray = function<T>(object: Record<string, T | T[]>, key: string): T[] {
  const value = object[key]
  return Array.isArray(value) ? value : [value]
}

Util.hasOwn = function(obj: any, prop: string | number | symbol): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

Util.inherit = function(
  parent: new (...args: any[]) => any,
  child: new (...args: any[]) => any
): void {
  child.prototype = Object.create(parent.prototype)
  Object.defineProperty(child.prototype, 'constructor', {
    value: child,
    enumerable: false,
    writable: true
  })
}

Util.isDigit = function(str: string): boolean {
  return str.length === 1 && /[0-9]/.test(str)
}

Util.isDigits = function(str: string): boolean {
  return /^[0-9]+$/.test(str)
}

Util.range = function(...args: number[]): number[] {
  let start: number, end: number, step: number

  if (args.length === 1) {
    start = 0
    end = args[0]
    step = 1
  }
  else if (args.length === 2) {
    [start, end] = args
    step = 1
  }
  else if (args.length === 3) {
    [start, end, step] = args
  }
  else {
    throw new Error('Invalid args to range function')
  }

  const output: number[] = []
  for (let i = start; i < end; i += step) {
    output.push(i)
  }
  return output
}

Util.stringReverse = function(str: string): string {
  return [...str].reverse().join("")
}

Util.toCamelCase = function(str: string): string {
  const downCased = str[0].toLowerCase() + str.slice(1)
  return downCased.replace(/\W/g, '')
}

Util.toCapsCase = function(str: string): string {
  return str.replace(/\W/g, '')
}

Util.toKebabCase = function(str: string): string {
  return str.toLowerCase().replace(/\W/g, '-')
}

Util.toPlainCase = function(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')   // Handle camelCase and PascalCase: insert space before uppercase letters
    .replace(/[_-]/g, ' ')                 // Replace underscores and hyphens with spaces
    .toLowerCase()                         // Convert to lowercase
    .replace(/\s+/g, ' ')                  // Clean up multiple spaces
    .trim()
}

Util.toTitleCase = function(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(token => token[0].toUpperCase() + token.slice(1))
    .join(' ')
}

Util.toSnakeCase = function(str: string): string {
  return str.toLowerCase().replace(/\W/g, '_')
}

Util.deepcopy = function<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

module.exports = Util

