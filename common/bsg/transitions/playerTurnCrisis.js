const { transitionFactory2 } = require('./factory.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'select-crisis',
      func: _selectCrisis,
    },
    {
      name: 'gaius-draw-skill-card',
      func: _gaiusDrawSkillCard,
    },
    {
      name: 'evaluateCrisisCard',
      func: _evaluateCrisisCard,
    },
    {
      name: 'cylonActivation',
      func: _cylonActivation,
    },
    {
      name: 'prepareForJump',
      func: _prepareForJump,
    },
    {
      name: 'cleanup',
      func: _cleanup,
    },
  ],
})

function _selectCrisis(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)

  if (game.checkPlayerIsRevealedCylon(player)) {
    game.mLog({ template: 'Crisis phase skipped for Cylon players' })
    return context.done()
  }

  // Initialization
  if (!game.getCrisis()) {
    if (game.getCardCharacterByPlayer(player).name === "Laura Roslin") {
      return context.push('player-turn-crisis-laura-roslin')
    }

    else {
      game.mMoveCard('decks.crisis', 'keep')
      const card = game.getZoneByName('keep').cards.slice(-1)[0]
      game.mSetCrisisActive(card)
    }
  }
}

function _gaiusDrawSkillCard(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const character = game.getCardCharacterByPlayer(player)
  if (character.name === 'Gaius Baltar') {
    return context.push('draw-skill-cards', {
      playerName: player.name,
      reason: 'Delusional Intuition',
    })
  }
}

function _evaluateCrisisCard(context) {
  return context.push('evaluate-crisis', {
    playerName: context.data.playerName
  })
}

function _cylonActivation(context) {
  const game = context.state
  const crisis = game.getCrisis()

  if (crisis.type !== 'Cylon Attack') {
    game.aActivateCylonShips(crisis.cylonActivation)
  }
}

function _prepareForJump(context) {
  const game = context.state
  const crisis = game.getCrisis()

  if (crisis.type !== 'Cylon Attack') {
    game.aPrepareForJump(crisis.jumpTrack)
    if (game.getCounterByName('jumpTrack') >= 4) {
      game.mLog({ template: 'auto-jumping the fleet' })
      return context.push('jump-the-fleet')
    }
  }
}

function _cleanup(context) {
  const game = context.state
  game.mCleanupCrisis()
}
