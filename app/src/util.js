const Util = {}
module.exports = Util


Util.deepcopy = function(obj) {
  return JSON.parse(JSON.stringify(obj))
}

Util.shuffleArray = function(array) {
  let currentIndex = array.length
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}
