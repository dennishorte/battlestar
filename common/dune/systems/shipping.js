'use strict'

// The Rise of Ix shipping track has four spaces.
// 0 is the empty bottom, below every reward. Freighters start there.
// 1 is the lowest reward, 2 the middle, 3 the top.
// Advancing pays nothing. Recalling pays the current reward and every reward below it.
// Version 7 takes those rewards from the highest space down.
// Older games still ask which one to take next, so a stored answer still matches its prompt.

const SPACE_NAMES = [null, 'Bottom', 'Middle', 'Top']
const TOP = 3

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
  if (position < TOP) {
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
  for (let space = fromPosition; space >= 1; space--) {
    pending.push(space)
  }
  // Visual only. The real track position stays put until the recall finishes,
  // so a nested freighter move still reads where the ship actually is.
  // While a reward is being chosen, the marker sits on that space.
  // The empty bottom (0) is not a reward, so a recall from there sets nothing.
  if (pending.length > 0) {
    game.state.freighterReward = { player: player.name, space: fromPosition }
  }
  while (pending.length > 0) {
    const space = pending.length === 1 || rewardsInFixedOrder(game)
      ? pending[0]
      : chooseSpace(game, player, pending)
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

function rewardsInFixedOrder(game) {
  return (game.settings.version || 1) >= 7
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
  if (space === 1) {
    payBottom(game, player)
  }
  else if (space === 2) {
    payMiddle(game, player)
  }
  else if (space === 3) {
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
  const tech = require('./tech.js')
  const hasTransports = tech.owns(game, player, 'troop-transports')
  const recruited = require('./deploy.js').recruitTroops(game, player, hasTransports ? 3 : 2)
  // The usual deploy step already includes troops recruited this turn when an
  // agent is on a combat space. Troop Transports is the other permission: any
  // of the troops just taken from the track may go to the Conflict, including
  // on a Reveal turn and from a space that is not a combat space.
  if (hasTransports) {
    offerShippingDeploy(game, player, recruited)
  }
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

function offerShippingDeploy(game, player, recruited) {
  if (recruited <= 0 || game.state.turnTracking?.shaddamNoDeploy) {
    return
  }
  if (agentTurnWillDeploy(game)) {
    return
  }
  const max = Math.min(recruited, player.troopsInGarrison)
  if (max <= 0) {
    return
  }
  const choices = []
  for (let i = 0; i <= max; i++) {
    choices.push(game.actions.option({
      id: `deploy-${i}`,
      title: `Deploy ${i} troop(s) to the Conflict`,
    }))
  }
  const [choice] = game.actions.choose(player, choices, {
    title: 'Deploy shipping troops to the Conflict',
    window: 'turn',
  })
  const choiceId = typeof choice === 'object' ? choice.id : choice
  const fromId = String(choiceId).match(/^deploy-(\d+)$/)
  const count = fromId
    ? Number(fromId[1])
    : Number(String(choice).match(/\d+/)?.[0] || 0)
  if (count > 0) {
    require('./deploy.js').deployFromGarrison(game, player, count)
  }
}

function agentTurnWillDeploy(game) {
  const tracking = game.state.turnTracking
  if (!tracking || tracking.isRevealTurn) {
    return false
  }
  if (tracking.spaceIsCombat || tracking.recruitToConflict) {
    return true
  }
  const spaceId = tracking.agentSpaceId
  if (!spaceId) {
    return false
  }
  const space = require('../res/boardSpaces.js').getBoardSpaces(game.settings)
    .find(entry => entry.id === spaceId)
  return !!space?.isCombatSpace
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
