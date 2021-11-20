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
  const skills = bsgutil.characterSkills(character)
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
    const chosen = bsgutil.flattenSkillSelection(context.response)
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
    game.mLog({
      template: '{player} is in sickbay and will only draw one card',
      args: {
        player: player.name,
      }
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
  const optionChoices = bsgutil.optionalSkillOptions(optionalSkills)
  return context.wait({
    actor: player.name,
    actions: [
      {
        name: 'Select Skills',
        count: optionChoices.length,
        options: optionChoices,
      },
    ]
  })
}
