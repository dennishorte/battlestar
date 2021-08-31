const Util = {}
module.exports = Util


Util.deepcopy = function(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/*
 * https://en.wikipedia.org/wiki/Schwartzian_transform
 */
Util.shuffleArray = function(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}
