const { transitionFactory } = require('./factory.js')
const bsgutil = require('../util.js')

module.exports = transitionFactory(
  {},
  playerTurnReceiveSkills,
  playerTurnReceiveSkills,
)

function playerTurnReceiveSkills(context) {
  const game = context.state
  const player = game.getPlayerCurrentTurn()

  const playerInSickbay = game.checkPlayerIsAtLocation(player, 'Sickbay')
  const playerIsRevealedCylon = game.checkPlayerIsRevealedCylon(player)
  const character = game.getCardCharacterByPlayer(player)
  const skills = _characterSkills(character)
  const optionalSkills = skills.filter(s => s.optional)
  const requiredSkills = skills.filter(s => !s.optional)
  const requiredSkillNames = []

  // Cylons don't have required skills
  // Players in sickbay only get a single skill card
  if (!playerIsRevealedCylon && !playerInSickbay) {
    for (const { name, value } of requiredSkills) {
      for (let i = 0; i < value; i++) {
        requiredSkillNames.push(name)
      }
    }
  }

  // Player has chosen their optional skills. Draw all skill cards
  if (context.response) {
    // Sometimes, the player is only making a single choice and returns a string.
    // Other times, they are making multiple choices, and return an array.
    const chosen = _flattenSkillSelection(context.response)
    const toDraw = requiredSkillNames.concat(chosen)
    game.aDrawSkillCards(player, toDraw)
    return context.done()
  }

  if (playerIsRevealedCylon) {
    return context.wait({
      actor: player.name,
      actions: [{
        name: 'Select Skills',
        count: 2,
        options: [...bsgutil.skillList, ...bsgutil.skillList].sort(),
      }]
    })
  }

  // Characters in sickbay can only draw one card.
  // Give them a list of options
  if (playerInSickbay) {
    game.rk.sessionStart(() => {
      game.mLog({
        template: '{player} is in sickbay and will only draw one card',
        args: {
          player: player.name,
        }
      })
    })

    const options = skills.map(c => c.name)
    return context.wait({
      actor: player.name,
      actions: [
        {
          name: 'Select Skills',
          count: 1,
          options,
        },
      ]
    })
  }

  // Automatically draw skill cards if possible.
  if (optionalSkills.length === 0) {
    game.aDrawSkillCards(player, requiredSkillNames)
    return context.done()
  }

  // Let the player choose which optional cards to draw.
  // Don't draw any cards until they have made their decision.
  return context.wait({
    actor: player.name,
    actions: [
      {
        name: 'Select Skills',
        operator: 'and',
        options: _optionalSkillOptions(optionalSkills),
      },
    ]
  })
}


function _characterSkills(character) {
  const output = []
  for (let skill of bsgutil.skillList) {
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

function _optionalSkillOptions(optionalSkills) {
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

function _flattenSkillSelection(selection) {
  let output = []
  for (const s of selection.option) {
    if (typeof s === 'string') {
      output.push(s)
    }
    else {
      output = output.concat(_flattenSkillSelection(s))
    }
  }
  return output
}
