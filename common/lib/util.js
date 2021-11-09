const seedrandom = require('seedrandom')


const Util = {
  array: {},
}
module.exports = Util

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

Util.assert = function(test, message) {
  if (!test) {
    throw new Error(message)
  }
}

Util.toCamelCase = function(str) {
  const downCased = str[0].toLowerCase() + str.slice(1)
  return downCased.replace(/\W/, '').replace(' ', '')
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
