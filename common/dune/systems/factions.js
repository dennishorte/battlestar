const constants = require('../res/constants.js')

/**
 * Gain influence with a faction. Handles VP at 2, bonus at 4, and alliance tracking.
 */
function gainInfluence(game, player, faction, amount = 1) {
  const prev = player.getInfluence(faction)
  const next = prev + amount

  player.setInfluence(faction, next)

  game.log.add({
    template: '{player} gains {amount} {faction} Influence ({prev} -> {next})',
    args: { player, amount, faction, prev, next },
  })

  // Leader influence hook
  const leaderAbilities = require('./leaderAbilities.js')
  leaderAbilities.onGainInfluence(game, player, faction, next, prev)

  // Check VP threshold at 2
  if (prev < constants.INFLUENCE_VP_THRESHOLD && next >= constants.INFLUENCE_VP_THRESHOLD) {
    player.incrementCounter('vp', 1, { silent: true, source: `${factionLabel(faction)} Influence (2+)` })
    game.log.add({
      template: '{player} reaches 2 {faction} Influence: +1 Victory Point',
      args: { player, faction },
    })
  }

  // Check bonus at 4
  if (prev < constants.INFLUENCE_BONUS_THRESHOLD && next >= constants.INFLUENCE_BONUS_THRESHOLD) {
    applyFactionBonus(game, player, faction)
  }

  // Check alliance at 4 (first to reach or overtake)
  if (next >= constants.INFLUENCE_BONUS_THRESHOLD) {
    checkAlliance(game, player, faction)
  }
}

/**
 * Lose influence with a faction. Handles VP loss when dropping below 2, and
 * alliance transfer if the alliance holder falls behind another player.
 */
function loseInfluence(game, player, faction, amount = 1) {
  const prev = player.getInfluence(faction)
  const next = Math.max(0, prev - amount)

  player.setInfluence(faction, next)

  game.log.add({
    template: '{player} loses {amount} {faction} Influence ({prev} -> {next})',
    args: { player, amount, faction, prev, next },
  })

  // Lose VP when dropping below 2
  if (prev >= constants.INFLUENCE_VP_THRESHOLD && next < constants.INFLUENCE_VP_THRESHOLD) {
    player.decrementCounter('vp', 1, { silent: true, source: `${factionLabel(faction)} Influence (lost)` })
    game.log.add({
      template: '{player} drops below 2 {faction} Influence: -1 Victory Point',
      args: { player, faction },
    })
  }

  checkAllianceOnLoss(game, player, faction)
}

/**
 * A player keeps the alliance as long as no one else has more influence than
 * them, regardless of how they first reached it (e.g. a first-to-4 tie). If
 * losing influence drops the holder strictly behind another player, the
 * alliance (and its VP) transfers rather than returning to the supply. When
 * multiple players are tied for the new highest influence, the player who
 * just lost influence chooses which of them receives it. If the holder drops
 * below the 4-influence threshold and no one else has reached it either, the
 * alliance returns to the supply instead of staying with an under-4 holder.
 */
function checkAllianceOnLoss(game, player, faction) {
  if (game.state.alliances[faction] !== player.name) {
    return
  }

  const holderInfluence = player.getInfluence(faction)
  const others = game.players.all().filter(p => p.name !== player.name)
  const maxOther = others.reduce((max, p) => Math.max(max, p.getInfluence(faction)), 0)

  if (maxOther <= holderInfluence) {
    if (holderInfluence < constants.INFLUENCE_BONUS_THRESHOLD) {
      game.state.alliances[faction] = null
      player.decrementCounter('vp', 1, { silent: true, source: `${factionLabel(faction)} Alliance (returned)` })
      game.log.add({
        template: '{player} drops below 4 {faction} Influence: the Alliance returns to the supply',
        args: { player, faction },
      })
    }
    return
  }

  const candidates = others.filter(p => p.getInfluence(faction) === maxOther)
  const newHolder = candidates.length === 1
    ? candidates[0]
    : game.actions.choosePlayer(player, candidates, {
      title: `Choose who receives the ${factionLabel(faction)} Alliance:`,
    })

  game.state.alliances[faction] = newHolder.name
  player.decrementCounter('vp', 1, { silent: true, source: `${factionLabel(faction)} Alliance (lost to ${newHolder.name})` })
  newHolder.incrementCounter('vp', 1, { silent: true, source: `${factionLabel(faction)} Alliance (from ${player.name})` })
  game.log.add({
    template: '{player} takes the {faction} Alliance from {holder}: VP transfers',
    args: { player: newHolder, faction, holder: player },
  })
}

/**
 * Apply the bonus for reaching 4 influence with a faction.
 */
function applyFactionBonus(game, player, faction) {
  game.log.add({
    template: '{player} reaches 4 {faction} Influence: bonus!',
    args: { player, faction },
  })

  switch (faction) {
    case 'emperor': {
      // Place a spy
      const spies = require('./spies.js')
      spies.placeSpy(game, player)
      break
    }
    case 'guild':
      // +3 Solari
      player.incrementCounter('solari', 3, { silent: true })
      game.log.add({ template: '{player} gains 3 Solari', args: { player } })
      break
    case 'bene-gesserit': {
      // +1 Intrigue card
      const deckEngine = require('./deckEngine.js')
      deckEngine.drawIntrigueCard(game, player, 1)
      break
    }
    case 'fremen':
      // +1 Water
      player.incrementCounter('water', 1, { silent: true })
      game.log.add({ template: '{player} gains 1 Water', args: { player } })
      break
  }
}

/**
 * Check if a player should receive or steal a faction alliance.
 * First player to 4 gets it. If someone overtakes them, the alliance transfers.
 */
function checkAlliance(game, player, faction) {
  const currentHolder = game.state.alliances[faction]

  if (!currentHolder) {
    // No one has the alliance yet — first to reach 4
    game.state.alliances[faction] = player.name
    player.incrementCounter('vp', 1, { silent: true, source: `${factionLabel(faction)} Alliance` })
    game.log.add({
      template: '{player} earns the {faction} Alliance: +1 Victory Point',
      args: { player, faction },
    })
    // Check contract completion
    const choam = require('./choam.js')
    choam.checkContractCompletion(game, player, 'earn-alliance', {})
  }
  else if (currentHolder !== player.name) {
    // Someone else has it — check if we overtake them
    const holder = game.players.byName(currentHolder)
    if (player.getInfluence(faction) > holder.getInfluence(faction)) {
      // Steal the alliance
      game.state.alliances[faction] = player.name
      holder.decrementCounter('vp', 1, { silent: true, source: `${factionLabel(faction)} Alliance (lost to ${player.name})` })
      player.incrementCounter('vp', 1, { silent: true, source: `${factionLabel(faction)} Alliance (from ${holder.name})` })
      game.log.add({
        template: '{player} takes the {faction} Alliance from {holder}: VP transfers',
        args: { player, faction, holder },
      })
    }
  }
}

function factionLabel(faction) {
  const labels = {
    'emperor': 'Emperor',
    'guild': 'Spacing Guild',
    'bene-gesserit': 'Bene Gesserit',
    'fremen': 'Fremen',
  }
  return labels[faction] || faction
}

/**
 * Get which player holds an alliance, if any.
 */
function getAllianceHolder(game, faction) {
  return game.state.alliances[faction]
}

/**
 * Present a single prompt for the player to choose `count` factions, then gain
 * +1 Influence with each. Use this for all "choose N factions to gain influence"
 * effects so they resolve in one pick instead of N sequential prompts.
 */
function gainInfluenceWithChoice(game, player, count = 1, title = '+1 Influence with:') {
  const factionChoices = constants.FACTIONS.map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
  const selections = game.actions.choose(player, factionChoices, { title, count })
  for (const choice of selections) {
    const faction = typeof choice === 'object' ? choice.id : choice
    gainInfluence(game, player, faction)
  }
}

module.exports = {
  gainInfluence,
  gainInfluenceWithChoice,
  loseInfluence,
  checkAlliance,
  getAllianceHolder,
}
