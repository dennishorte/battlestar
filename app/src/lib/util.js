const Util = {}
module.exports = Util

Util.deepcopy = function(obj) {
  return JSON.parse(JSON.stringify(obj))
}
