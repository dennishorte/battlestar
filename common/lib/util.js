const seedrandom = require('seedrandom')


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

Util.array.toDict = function(array, f) {
  return Object.assign({}, ...array.map(x => f(x)))
}

Util.assert = function(test, message) {
  if (!test) {
    throw new Error(message)
  }
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

Util.deepcopy = function(obj) {
  return JSON.parse(JSON.stringify(obj))
}

Util.randomSeed = function(prefix) {
  if (!prefix) {
    prefix = "random-prefix"
  }

  const rng = seedrandom()
  return prefix + rng()
}
