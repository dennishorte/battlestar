const seedrandom = require('seedrandom')


const Util = {}
module.exports = Util

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

Util.shuffleArray = function(array, randomizer) {
  if (!randomizer) {
    randomizer = Math.random
  }

  let currentIndex = array.length
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(randomizer() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}
