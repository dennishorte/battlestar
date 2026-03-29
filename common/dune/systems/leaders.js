const { parseAgentAbility } = require('./cardEffects.js')

/**
 * Leader system for Dune Imperium: Uprising.
 *
 * Each player selects a leader at game start. Leaders provide:
 * - leaderAbility: A passive or triggered effect during play
 * - signetRingAbility: Activated when the Signet Ring card is played
 * - startingEffect: Optional game-start modification
 */

/**
 * Initialize leaders: each player selects one.
 */
function selectLeaders(game) {
  const leaderData = require('../res/leaders/index.js')
  const settings = game.settings

  // Filter leaders by compatibility
  let available = leaderData.filter(l => {
    if (l.compatibility === 'All') {
      return true
    }
    if (l.compatibility === 'Uprising') {
      return true
    }
    return false
  })

  // Random assignment if configured, otherwise let each player choose
  if (settings.randomLeaders) {
    // Shuffle and deal one to each player
    const shuffled = [...available]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(game.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    for (const player of game.players.all()) {
      const leader = shuffled.pop()
      assignLeader(game, player, leader)
    }
  }
  else {
    // Each player picks from remaining leaders
    const remaining = [...available]
    for (const player of game.players.all()) {
      const names = remaining.map(l => l.name)
      const [choice] = game.actions.choose(player, names, {
        title: 'Choose a Leader',
      })
      const leader = remaining.find(l => l.name === choice)
      remaining.splice(remaining.indexOf(leader), 1)
      assignLeader(game, player, leader)
    }
  }
}

/**
 * Assign a leader to a player and apply starting effects.
 */
function assignLeader(game, player, leader) {
  game.state.leaders[player.name] = leader

  game.log.add({
    template: '{player} is {leader}',
    args: { player, leader: leader.name },
  })

  // Apply starting effects for known leaders
  if (leader.name === 'Glossu "The Beast" Rabban') {
    player.incrementCounter('spice', 1, { silent: true })
    player.incrementCounter('solari', 1, { silent: true })
    game.log.add({
      template: '{player} gains 1 Spice and 1 Solari (Arrakis Fiefdom)',
      args: { player },
    })
  }
}

/**
 * Resolve Signet Ring ability for a player.
 * Called when the Signet Ring card is played as an agent.
 */
function resolveSignetRing(game, player, resolveEffectFn) {
  const leader = game.state.leaders[player.name]
  if (!leader) {
    return
  }

  const abilityText = leader.signetRingAbility
  if (!abilityText) {
    return
  }

  game.log.add({
    template: '{player} activates Signet Ring: {ability}',
    args: { player, ability: leader.name },
  })

  const effects = parseAgentAbility(abilityText)
  if (effects) {
    game.log.indent()
    for (const effect of effects) {
      resolveEffectFn(game, player, effect, null)
    }
    game.log.outdent()
  }
  else {
    game.log.indent()
    game.log.add({
      template: '{effect}',
      args: { effect: abilityText },
      event: 'memo',
    })
    game.log.outdent()
  }
}

/**
 * Get a player's leader data.
 */
function getLeader(game, player) {
  return game.state.leaders[player.name] || null
}

module.exports = {
  selectLeaders,
  assignLeader,
  resolveSignetRing,
  getLeader,
}
