const Util = {}
module.exports = Util


Util.characterNameToCssClass = function(name) {
  return name.toLowerCase().replaceAll('"', '').replaceAll(' ', '-')
}
