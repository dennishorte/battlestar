const Util = {
  array: {},
  dict: {},
  event: {},
  point: {},
}
module.exports = Util


////////////////////////////////////////////////////////////////////////////////
// Array functions

Util.array.chunk = function(array, size) {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Groups array elements by keys and collects them into an object.
 *
 * @param {Array} elems - The array of elements to process
 * @param {Function} keyFunc - Function that returns a key or array of keys for each element
 * @param {Function} [valueFunc] - Optional function to transform each element before collection
 * @returns {Object} An object where keys are the results of keyFunc and values are arrays of
 *                   (transformed) elements that correspond to each key
 */
Util.array.collect = function(elems, keyFunc, valueFunc = elem => elem) {
  const output = {}

  if (!Array.isArray(elems) || elems.length === 0) {
    return output
  }

  for (const elem of elems) {
    // Normalize keys to always be an array
    const keys = [].concat(keyFunc(elem))

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

Util.array.countBy = function(array, fn) {
  return array.reduce((counts, elem) => {
    counts[fn(elem)] = (counts[fn(elem)] || 0) + 1
    return counts
  }, {})
}

/**
 * Returns an array of distinct elements based on the key function.
 * If multiple elements have the same key, only the first one is kept.
 * 
 * @param {Array} array - The array to process
 * @param {Function} keyFunc - Function to extract the key for comparison
 * @returns {Array} Array with duplicate elements removed
 */
Util.array.distinct = function(array, keyFunc = elem => elem) {
  if (!array || array.length === 0) {
    return []
  }
  
  const seen = new Set()
  const result = []
  
  for (const item of array) {
    const key = keyFunc(item)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }
  
  return result
}

Util.array.elementsEqual = function(a, b) {
  return (
    a.length === b.length
    && a.every((elem, index) => elem === b[index])
  )
}

Util.array.fill = function(count, value) {
  const output = []
  for (let i = 0; i < count; i++) {
    output.push(value)
  }
  return output
}

Util.array.intersection = function(array1, array2) {
  return array1.filter(x => array2.includes(x))
}

Util.array.isDistinct = function(array) {
  return array.length === Util.array.distinct(array).length
}

Util.array.groupBy = function(array, fn) {
  const groups = {}
  for (let i = 0; i < array.length; i++) {
    const key = fn(array[i], i, array)
    if (!groups.hasOwnProperty(key)) {
      groups[key] = []
    }

    groups[key].push(array[i])
  }
  return groups
}

Util.array.last = function(array) {
  if (array.length === 0) {
    throw new Error('Cannot call last on empty array')
  }
  return array[array.length - 1]
}

Util.array.pairs = function(array) {
  return array.flatMap(
    (v, i) => array.slice(i+1).map(w => [v, w])
  )
}

Util.array.pushUnique = function(array, value) {
  if (array.indexOf(value) === -1) {
    array.push(value)
  }
}

Util.array.remove = function(array, elem) {
  const index = array.indexOf(elem)
  if (index !== -1) {
    array.splice(index, 1)
  }
}

Util.array.removeByPredicate = function(array, pred) {
  const index = array.find(pred)
  if (index !== -1) {
    array.splice(index, 1)
  }
}

Util.array.reverseIter = function*(array) {
  let i = array.length
  while (i > 0) {
    i -= 1
    yield array[i]
  }
}

Util.array.select = function(array, rng) {
  if (!rng) {
    rng = Math.random
  }

  const index = Math.floor(rng() * array.length)
  return array[index]
}

Util.array.selectMany = function(array, count, rng) {
  return Util.array.shuffle([...array], rng).slice(0, count)
}

Util.array.shuffle = function(array, rng) {
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

Util.array.swap = function(array, i, j) {
  const tmp = array[i]
  array[i] = array[j]
  array[j] = tmp
}

Util.array.takeRightWhile = function(array, predicate) {
  const accumulator = []
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

Util.array.takeWhile = function(array, predicate) {
  const accumulator = []
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
 * @param {Array} array - Array of objects to convert
 * @param {Function|string} keyFn - Function to extract key or property name to use as key
 * @returns {Object} Dictionary mapping keys to objects
 */
Util.array.toDict = function(array, keyFn) {
  const keyFunc = typeof keyFn === 'string'
    ? (obj) => obj[keyFn]
    : keyFn

  const result = {}

  for (const item of array) {
    const key = keyFunc(item)
    if (key != null) {
      result[key] = item
    }
  }

  return result
}

Util.array.uniqueMaxBy = function(array, pred) {
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

Util.dict.map = function(dict, func) {
  const output = {}
  for (const [key, value] of Object.entries(dict)) {
    const [okey, ovalue] = func(key, value)
    output[okey] = ovalue
  }
  return output
}


////////////////////////////////////////////////////////////////////////////////
// Event Functions

Util.event.offsetPoint = function(event) {
  return {
    x: event.offsetX,
    y: event.offsetY,
  }
}


////////////////////////////////////////////////////////////////////////////////
// Point Functions

Util.point.add = function(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  }
}

Util.point.sub = function(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  }
}


////////////////////////////////////////////////////////////////////////////////
// Miscellaneous

Util.assert = function(test, message) {
  if (!test) {
    throw new Error(message)
  }
}

Util.ensure = function(obj, prop, defaultValue) {
  if (!Util.hasOwn(obj, prop)) {
    obj[prop] = defaultValue
  }
  return obj
}

Util.getAsArray = function(object, key) {
  const value = object[key]
  return Array.isArray(value) ? value : [value]
}

Util.hasOwn = function(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

Util.inherit = function(parent, child) {
  child.prototype = Object.create(parent.prototype)
  Object.defineProperty(child.prototype, 'constructor', {
    value: child,
    enumerable: false,
    writable: true
  })
}

Util.isDigit = function(str) {
  return str.length === 1 && /[0-9]/.test(str)
}

Util.range = function(...args) {
  let start, end, step

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

  const output = []
  for (let i = start; i < end; i += step) {
    output.push(i)
  }
  return output
}

Util.stringReverse = function(str) {
  return [...str].reverse().join("")
}

Util.toCamelCase = function(str) {
  const downCased = str[0].toLowerCase() + str.slice(1)
  return downCased.replace(/\W/g, '')
}

Util.toCapsCase = function(str) {
  return str.replace(/\W/g, '')
}

Util.toKebabCase = function(str) {
  return str.toLowerCase().replace(/\W/g, '-')
}

Util.toTitleCase = function(str) {
  return str
    .toLowerCase()
    .split()
    .map(token => token[0].toUpperCase() + token.slice(1))
    .join(' ')
}

Util.toSnakeCase = function(str) {
  return str.toLowerCase().replace(/\W/g, '_')
}

Util.deepcopy = function(obj) {
  return JSON.parse(JSON.stringify(obj))
}
