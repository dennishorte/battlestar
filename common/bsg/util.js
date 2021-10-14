const Util = {}
module.exports = Util


Util.characterNameToCssClass = function(name) {
  return name.toLowerCase().replace(/"/g, '').replace(/ /g, '-')
}

Util.expansionFilter = function(cards, expansions) {
  return cards.filter(c => expansions.includes(c.expansion))
}

Util.skillList = [
  'politics',
  'leadership',
  'tactics',
  'piloting',
  'engineering',
]

Util.skillType = function(card) {
  if (card.politics) return 'politics'
  if (card.leadership) return 'leadership'
  if (card.tactics) return 'tactics'
  if (card.piloting) return 'piloting'
  if (card.engineering) return 'engineering'
  if (card.treachery) return 'treachery'
  return 'UNKNOWN'
}
