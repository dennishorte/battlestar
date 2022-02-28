const Util = {
  array: {},
}
module.exports = Util

Util.array.distinct = function(array) {
  return [...new Set(array)]
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

Util.array.reverseIter = function*(array) {
  let i = array.length
  while (i > 0) {
    i -= 1
    yield array[i]
  }
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

Util.array.toDict = function(array) {
  const dict = {}
  for (const [key, value] of array) {
    dict[key] = value
  }
  return dict
}

Util.assert = function(test, message) {
  if (!test) {
    throw new Error(message)
  }
}

Util.getAsArray = function(object, key) {
  const value = object[key]
  return Array.isArray(value) ? value : [value]
}

Util.inherit = function(parent, child) {
  child.prototype = Object.create(parent.prototype)
  Object.defineProperty(child.prototype, 'constructor', {
    value: child,
    enumerable: false,
    writable: true
  })
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

Util.deepcopy = function(obj) {
  return JSON.parse(JSON.stringify(obj))
}
