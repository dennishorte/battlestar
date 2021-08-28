const Util = {}
module.exports = Util


Util.characterNameToCssClass = function(name) {
  return name.toLowerCase().replaceAll('"', '').replaceAll(' ', '-')
}

Util.deepcopy = function(obj) {
  return JSON.parse(JSON.stringify(obj))
}

Util.skillList = [
  'politics',
  'leadership',
  'tactics',
  'piloting',
  'engineering',
  'treachery',
]
