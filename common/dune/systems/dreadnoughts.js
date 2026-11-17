// Deploying, parking, and recalling dreadnoughts.
// A dreadnought commissioned or recruited this turn can be deployed,
// plus up to two units that were already in the garrison.

const CONTROL_SPACES = ['arrakeen', 'spice-refinery', 'imperial-basin']

function useShips(game) {
  return !!game.settings?.useRiseOfIx
}

function optionTitle(troops, ships, troopStyle) {
  if (ships <= 0) {
    return troopStyle === 'short'
      ? `Deploy ${troops}`
      : `Deploy ${troops} troop(s) from garrison`
  }
  if (troops <= 0) {
    return `Deploy ${ships} dreadnought${ships === 1 ? '' : 's'}`
  }
  const troopWord = troops === 1 ? 'troop' : 'troops'
  const shipWord = ships === 1 ? 'dreadnought' : 'dreadnoughts'
  return `Deploy ${troops} ${troopWord} and ${ships} ${shipWord}`
}

function optionId(troops, ships) {
  if (ships <= 0) {
    return `deploy-${troops}`
  }
  return `deploy-t${troops}-s${ships}`
}

/**
 * Agent-turn deployment. Fresh units (troops recruited or dreadnoughts
 * commissioned since the turn began) are not limited by the two-from-garrison
 * cap. Units that were already garrisoned share that cap of two.
 * recruitedOnly keeps today's troop-only rule for a non-combat space.
 */
function listAgentDeployOptions(game, player, opts = {}) {
  const troops = player.troopsInGarrison
  const ships = useShips(game) ? player.dreadnoughtsInGarrison : 0
  const troopsAtStart = game.state.turnTracking?.garrisonAtTurnStart ?? troops
  const shipsAtStart = game.state.turnTracking?.dreadnoughtsAtTurnStart ?? ships
  const newTroops = Math.max(0, troops - troopsAtStart)
  const newShips = opts.recruitedOnly ? 0 : Math.max(0, ships - shipsAtStart)
  const maxTroops = opts.recruitedOnly ? Math.min(troops, newTroops) : troops
  const maxShips = opts.recruitedOnly ? 0 : ships

  const options = []
  for (let t = 0; t <= maxTroops; t++) {
    for (let s = 0; s <= maxShips; s++) {
      const oldUsed = Math.max(0, t - newTroops) + Math.max(0, s - newShips)
      if (!opts.recruitedOnly && oldUsed > 2) {
        continue
      }
      options.push({
        troops: t,
        ships: s,
        id: optionId(t, s),
        title: optionTitle(t, s, 'garrison'),
      })
    }
  }
  return options
}

/** Up to `limit` units from the garrison, troops and dreadnoughts together. */
function listGarrisonChoices(game, player, limit) {
  const troops = player.troopsInGarrison
  const ships = useShips(game) ? player.dreadnoughtsInGarrison : 0
  const options = []
  for (let t = 0; t <= Math.min(limit, troops); t++) {
    const shipMax = Math.min(limit - t, ships)
    for (let s = 0; s <= shipMax; s++) {
      options.push({
        troops: t,
        ships: s,
        id: optionId(t, s),
        title: ships > 0 ? optionTitle(t, s, 'garrison') : optionTitle(t, 0, 'short'),
      })
    }
  }
  return options
}

function deploySelected(game, player, troops, ships) {
  const deploy = require('./deploy.js')
  if (troops > 0) {
    deploy.deployFromGarrison(game, player, troops)
  }
  if (ships > 0) {
    deploy.deployDreadnoughtsFromGarrison(game, player, ships)
  }
}

function parseDeployChoice(choice) {
  const choiceId = typeof choice === 'object' ? choice.id : null
  if (!choiceId || choiceId === 'continue') {
    return null
  }
  const mixed = choiceId.match(/^deploy-t(\d+)-s(\d+)$/)
  if (mixed) {
    return { troops: Number(mixed[1]), ships: Number(mixed[2]) }
  }
  const troopsOnly = choiceId.match(/^deploy-(\d+)$/)
  if (troopsOnly) {
    return { troops: Number(troopsOnly[1]), ships: 0 }
  }
  return null
}

function returnToGarrison(game, player, count) {
  const n = Math.min(count, player.dreadnoughtsInConflict)
  if (n <= 0) {
    return
  }
  player.decrementCounter('dreadnoughtsInConflict', n, { silent: true })
  player.incrementCounter('dreadnoughtsInGarrison', n, { silent: true })
  game.log.add({
    template: '{player} returns {count} dreadnought(s) to the garrison',
    args: { player, count: n },
  })
}

function openControlSpaces(game) {
  const parked = game.state.parkedDreadnoughts || {}
  return CONTROL_SPACES.filter(id => !parked[id])
}

function spaceName(game, id) {
  const spaces = require('../res/boardSpaces.js').getBoardSpaces(game.settings)
  return spaces.find(space => space.id === id)?.name || id
}

function parkOn(game, player, location) {
  const covered = game.state.controlMarkers[location] ?? null
  game.state.parkedDreadnoughts[location] = {
    owner: player.name,
    covered,
    round: game.state.round,
  }
  game.state.controlMarkers[location] = player.name
  player.decrementCounter('dreadnoughtsInConflict', 1, { silent: true })
  game.log.add({
    template: '{player} parks a dreadnought on {location}',
    args: { player, location: spaceName(game, location) },
  })
}

function detonate(game, player) {
  player.decrementCounter('dreadnoughtsInConflict', 1, { silent: true })
  player.incrementCounter('dreadnoughtsInSupply', 1, { silent: true })
  player.incrementCounter('vp', 1, { silent: true })
  game.log.add({
    template: '{player} sends a dreadnought to the supply for 1 Victory Point (Detonation Devices)',
    args: { player },
  })
}

/**
 * After rewards: the winner may detonate or park one dreadnought.
 * Everyone else's dreadnoughts, and any the winner does not park, go to the garrison.
 */
function settleConflictDreadnoughts(game, winner) {
  if (!useShips(game)) {
    return
  }
  for (const player of game.players.all()) {
    if (winner && player.name === winner.name) {
      continue
    }
    returnToGarrison(game, player, player.dreadnoughtsInConflict)
  }
  if (!winner || winner.dreadnoughtsInConflict <= 0) {
    return
  }

  const tech = require('./tech.js')
  const canDetonate = tech.owns(game, winner, 'detonation-devices')
  if (canDetonate) {
    const [choice] = game.actions.choose(winner, [
      game.actions.option({ id: 'detonate', title: 'Send it to your supply' }),
      game.actions.option({ id: 'keep', title: 'Do not' }),
    ], { title: 'Detonation Devices: 1 Victory Point instead of parking?' })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    if (choiceId === 'detonate' || choice === 'Send it to your supply') {
      detonate(game, winner)
      returnToGarrison(game, winner, winner.dreadnoughtsInConflict)
      return
    }
  }

  const open = openControlSpaces(game)
  if (open.length === 0) {
    returnToGarrison(game, winner, winner.dreadnoughtsInConflict)
    return
  }
  let location = open[0]
  if (open.length > 1) {
    const [choice] = game.actions.choose(winner, open.map(id => game.actions.option({
      id,
      title: spaceName(game, id),
    })), { title: 'Park a dreadnought' })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    location = open.find(id => id === choiceId)
      || open.find(id => spaceName(game, id) === choice)
      || open[0]
  }
  parkOn(game, winner, location)
  returnToGarrison(game, winner, winner.dreadnoughtsInConflict)
}

/** A dreadnought parked last round comes home at the end of this combat. */
function recallParkedDreadnoughts(game) {
  if (!useShips(game)) {
    return
  }
  const parked = game.state.parkedDreadnoughts || {}
  for (const location of Object.keys(parked)) {
    const info = parked[location]
    if (!info || info.round >= game.state.round) {
      continue
    }
    const player = game.players.byName(info.owner)
    if (player) {
      player.incrementCounter('dreadnoughtsInGarrison', 1, { silent: true })
      game.log.add({
        template: '{player} recalls a dreadnought to the garrison from {location}',
        args: { player, location: spaceName(game, location) },
      })
    }
    game.state.controlMarkers[location] = info.covered ?? null
    delete parked[location]
  }
}

module.exports = {
  listAgentDeployOptions,
  listGarrisonChoices,
  deploySelected,
  parseDeployChoice,
  settleConflictDreadnoughts,
  recallParkedDreadnoughts,
}
