const Util = {}
module.exports = Util


Util.characterNameToCssClass = function(name) {
  return name.toLowerCase().replace(/"/g, '').replace(/ /g, '-')
}

Util.expansionFilter = function(cards, expansions) {
  return cards.filter(c => expansions.includes(c.expansion))
}

Util.rollDie = function() {
  return Math.floor(Math.random() * 8) + 1
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


Util.characterSkills = function(character) {
  const output = []
  for (let skill of Util.skillList) {
    skill = skill.toLowerCase()
    const charSkill = character[skill]
    if (charSkill) {
      const optional = charSkill.slice(-1) === '*'
      const value = parseInt(charSkill)

      output.push({
        name: skill,
        value,
        optional,
      })
    }
  }

  return output
}

Util.optionalSkillOptions = function(optionalSkills) {
  if (optionalSkills.length === 0) {
    return []
  }

  const options = []
  const optionalPairs = [optionalSkills[0].name, optionalSkills[1].name]
  for (let i = 0; i < optionalSkills[0].value; i++) {
    options.push({
      name: 'Optional Skills',
      options: optionalPairs
    })
  }
  return options
}

Util.flattenSkillSelection = function(selection) {
  let output = []
  for (const s of selection.option) {
    if (typeof s === 'string') {
      output.push(s)
    }
    else {
      output = output.concat(Util.flattenSkillSelection(s))
    }
  }
  return output
}
