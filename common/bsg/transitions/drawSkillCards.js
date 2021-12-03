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

  let count = 1
  let options = [
    'politics',
    'leadership',
    'tactics',
    'piloting',
    'engineering',
  ]

  if (reason === 'Research Lab') {
    options = ['engineering', 'tactics']
  }

  else if (reason === 'Consolidate Power') {
    count = 2
    options = [
      'politics',
      'politics',
      'leadership',
      'leadership',
      'tactics',
      'tactics',
      'piloting',
      'piloting',
      'engineering',
      'engineering',
    ]
  }

  return context.wait({
    actor: context.data.playerName,
    actions: [{
      name: reason,
      count,
      options,
    }]
  })
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
