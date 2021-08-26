const Util = {}
module.exports = Util


Util.characterNameToCssClass = function(name) {
  return name.toLowerCase().replaceAll('"', '').replaceAll(' ', '-')
}

Util.skillList = [
  'politics',
  'leadership',
  'tactics',
  'piloting',
  'engineering',
  'treachery',
]
