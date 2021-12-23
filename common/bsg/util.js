const Util = {}
module.exports = Util

Util.MAX_PLAYERS = 6

Util.calculateCheckValue = function(cards, options) {
  const {
    skills,
    declareEmergency,
    inspirationalLeader,
    scientificResearch,
  } = options

  let total = declareEmergency ? 2 : 0

  for (const card of cards) {
    if (
      skills.includes(card.skill)
      || (card.skill === 'engineering' && scientificResearch)
      || (card.value === 1 && inspirationalLeader)
    ) {
      total += card.value
    }
    else {
      total -= card.value
    }
  }

  return total
}

Util.characterNameToCssClass = function(name) {
  return name.toLowerCase().replace(/"/g, '').replace(/ /g, '-')
}

Util.expansionFilter = function(cards, expansions) {
  return cards.filter(c => expansions.includes(c.expansion))
}

Util.rollDieResult = function(roll, targetString) {
  const targetValue = parseInt(targetString.slice(0, 1))
  const direction = targetString.slice(-1)

  if (direction === '+' && roll >= targetValue) {
    return true
  }
  else if (direction === '-' && roll <= targetValue) {
    return true
  }
  else {
    return false
  }
}

Util.optionName = function(option) {
  return option.name || option
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
      name: `Optional Skills ${i+1}`,
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

function GameOverTrigger(message, winner) {
  this.message = message
  this.winner = winner
  // Use V8's native method if available, otherwise fallback
  if ("captureStackTrace" in Error)
    Error.captureStackTrace(this, GameOverTrigger)
  else
    this.stack = (new Error()).stack
}
GameOverTrigger.prototype = Object.create(Error.prototype)
GameOverTrigger.prototype.name = "GameOverTrigger"
GameOverTrigger.prototype.constructor = GameOverTrigger
Util.GameOverTrigger = GameOverTrigger
