const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'initializeZones',
      func: _initializeZones,
    },
    {
      name: 'shuffleDecks',
      func: _shuffleDecks,
    },
    {
      name: 'selectAchievements',
      func: _selectAchievements,
    },
    {
      name: 'dealStartingCards',
      func: _dealStartingCards
    },
  ]
})

function _initializeZones(context) {
  const game = context.state
  const state = game.state

  return context.wait({
    actor: 'dennis',
    name: 'wait',
    options: []
  })
}

function _shuffleDecks(context) {
  const game = context.state
  for (const age of [1,2,3,4,5,6,7,8,9,10]) {
    for (const exp of game.getExpansionList()) {
      game.mShuffleZone(game.getZoneByAge(exp, age))
    }
  }
}

function _selectAchievements(context) {
  const game = context.state
  for (const age of [1,2,3,4,5,6,7,8,9]) {
    game.mMoveCard(game.getDeckByAge('base', age), 'achievements')
  }
}

function _dealStartingCards(context) {
  const game = context.state
  for (const player of game.getPlayerAll()) {
    game.mDraw(player, 1)
    game.mDraw(player, 1)
  }
}
