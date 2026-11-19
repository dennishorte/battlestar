'use strict'

// The Rise of Ix shipping track. 0 is the bottom space, 1 the middle, 2 the top.
// Advancing pays nothing. Recalling pays the current space and every space below it.

const SPACE_NAMES = ['Bottom', 'Middle', 'Top']

function moveFreighter(game, player, times = 1) {
  if (!game.settings?.useRiseOfIx) {
    return
  }
  const moves = Math.max(0, times)
  for (let i = 0; i < moves; i++) {
    moveOnce(game, player)
  }
}

function moveOnce(game, player) {
  const position = player.freighterPosition
  const choices = []
  if (position < 2) {
    choices.push(game.actions.option({ id: 'advance', title: 'Advance' }))
  }
  choices.push(game.actions.option({ id: 'recall', title: 'Recall' }))

  const [choice] = game.actions.choose(player, choices, { title: 'Move your Freighter' })
  const choiceId = typeof choice === 'object' ? choice.id : choice
  if (choiceId === 'advance' || choice === 'Advance') {
    const next = position + 1
    player.setCounter('freighterPosition', next, { silent: true })
    game.log.add({
      template: '{player} advances the Freighter to the {space}',
      args: { player, space: SPACE_NAMES[next] },
    })
    return
  }
  recall(game, player, position)
}

function recall(game, player, fromPosition) {
  const pending = []
  for (let space = fromPosition; space >= 0; space--) {
    pending.push(space)
  }
  // Visual only. The real track position stays put until the recall finishes,
  // so a nested freighter move still reads where the ship actually is.
  // While a reward is being chosen, the marker sits on that space.
  game.state.freighterReward = { player: player.name, space: fromPosition }
  while (pending.length > 0) {
    const space = pending.length === 1 ? pending[0] : chooseSpace(game, player, pending)
    game.state.freighterReward = { player: player.name, space }
    paySpace(game, player, space)
    pending.splice(pending.indexOf(space), 1)
  }
  game.state.freighterReward = null
  player.setCounter('freighterPosition', 0, { silent: true })
  game.log.add({
    template: '{player} recalls the Freighter to the bottom',
    args: { player },
  })
}

function chooseSpace(game, player, pending) {
  const [choice] = game.actions.choose(player, pending.map(space => game.actions.option({
    id: `space-${space}`,
    title: SPACE_NAMES[space],
  })), { title: 'Take a Shipping reward' })
  const choiceId = typeof choice === 'object' ? choice.id : choice
  const fromId = String(choiceId).match(/^space-(\d)$/)
  if (fromId) {
    return Number(fromId[1])
  }
  return SPACE_NAMES.indexOf(choice)
}

function paySpace(game, player, space) {
  if (space === 0) {
    payBottom(game, player)
  }
  else if (space === 1) {
    payMiddle(game, player)
  }
  else {
    payTop(game, player)
  }
}

function payBottom(game, player) {
  const [choice] = game.actions.choose(player, [
    game.actions.option({ id: 'dividends', title: 'Dividends' }),
    game.actions.option({ id: 'spice', title: '2 Spice' }),
  ], { title: 'Bottom of the Shipping track' })
  const choiceId = typeof choice === 'object' ? choice.id : choice
  if (choiceId === 'spice' || choice === '2 Spice') {
    player.incrementCounter('spice', 2, { silent: true })
    if (game.state.turnTracking) {
      game.state.turnTracking.spiceGained += 2
    }
    game.log.add({
      template: '{player} gains {amount} {resource}',
      args: { player, amount: 2, resource: 'spice' },
    })
    return
  }
  gainSolari(game, player, 5)
  for (const other of game.players.all()) {
    if (other.name !== player.name) {
      gainSolari(game, other, 1)
    }
  }
}

function payMiddle(game, player) {
  const extra = require('./tech.js').owns(game, player, 'troop-transports') ? 1 : 0
  require('./deploy.js').recruitTroops(game, player, 2 + extra)
  const factions = require('../res/constants.js').FACTIONS
  const [choice] = game.actions.choose(player, factions.map(faction => game.actions.option({
    id: faction,
    title: faction,
    kind: 'faction',
  })), { title: 'Shipping: +1 Influence' })
  const faction = typeof choice === 'object' ? choice.id : choice
  require('./factions.js').gainInfluence(game, player, faction, 1)
}

function payTop(game, player) {
  require('./tech.js').acquireTech(game, player, { discount: 2 })
}

function gainSolari(game, player, amount) {
  player.incrementCounter('solari', amount, { silent: true })
  game.log.add({
    template: '{player} gains {amount} {resource}',
    args: { player, amount, resource: 'solari' },
  })
  require('./leaderAbilities.js').onGainSolari(game, player, amount)
}

module.exports = {
  moveFreighter,
}
