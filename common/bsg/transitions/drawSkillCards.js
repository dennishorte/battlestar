const { transitionFactory } = require('./factory.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)


function generateOptions(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const reason = context.data.reason

  if (reason === 'Research Lab') {
    return context.wait({
      actor: player.name,
      actions: [{
        name: 'Draw Skill Cards',
        options: ['engineering', 'tactics'],
      }]
    })
  }

  else if (reason === 'Delusional Intuition') {
    return context.wait({
      actor: player.name,
      actions: [{
        name: 'Delusional Intuition',
        options: [
          'politics',
          'leadership',
          'tactics',
          'piloting',
          'engineering',
        ]
      }]
    })
  }

  else {
    throw new Error(`Invalid reason for card drawing provided: ${reason}`)
  }
}

function handleResponse(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const skillNames = _flattenSkillSelection(context.response)
  game.aDrawSkillCards(player, skillNames)
  return context.done()
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
