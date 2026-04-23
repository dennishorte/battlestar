const { parseAgentAbility } = require('./cardEffects.js')

/**
 * Leader system for Dune Imperium: Uprising.
 *
 * Per-leader data and behavior live in res/leaders/<Name>.js. Each file
 * exports an object with data fields plus optional hook methods
 * (onAssign, onAgentTurnStart, onRevealTurn, modifySpaceCost,
 * resolveSignetRing, ...). systems/leaderAbilities.js dispatches hooks
 * during gameplay; this module handles leader selection and assignment.
 */

/**
 * Initialize leaders: deal 2 to each player, all choose simultaneously.
 */
function selectLeaders(game) {
  if (game.players.all().every(p => game.state.leaders[p.name])) {
    return
  }

  const res = require('../res/index.js')
  const available = res.getLeaders(game.settings)

  const shuffled = [...available]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(game.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  const dealt = {}
  for (const player of game.players.all()) {
    dealt[player.name] = [shuffled.pop(), shuffled.pop()]
  }

  const selectors = game.players.all().map(player => ({
    actor: player.name,
    title: 'Choose a Leader',
    choices: dealt[player.name].map(l => l.name),
  }))

  const responses = game.requestInputMany(selectors)

  for (const response of responses) {
    const player = game.players.byName(response.actor)
    const chosenName = response.selection[0]
    const leader = dealt[player.name].find(l => l.name === chosenName)
    assignLeader(game, player, leader)
  }
}

/**
 * Assign a leader to a player and run its onAssign hook (starting effects).
 */
function assignLeader(game, player, leader) {
  game.state.leaders[player.name] = leader

  game.log.add({
    template: '{player} is {leader}',
    args: { player, leader: leader.name },
  })

  if (typeof leader.onAssign === 'function') {
    leader.onAssign(game, player)
  }
}

/**
 * Resolve the Signet Ring card for a player.
 *
 * Priority order:
 *   1. leader.resolveSignetRing — fully custom resolution (Lady Jessica,
 *      Feyd, Helena, Liet Kynes, Shaddam, Irulan, Margot, Amber, Yuna, Rabban,
 *      Staban).
 *   2. parseAgentAbility on the signetRingAbility text — for simple effects
 *      like "+1 Troop" / "+1 Solari" / "Draw 1 card".
 *   3. Log the ability text as a memo (manual resolution).
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

  if (typeof leader.resolveSignetRing === 'function') {
    leader.resolveSignetRing(game, player, resolveEffectFn, parseAgentAbility)
    return
  }

  // Signet ring text starts with the ability name followed by a newline,
  // then bullet-prefixed effects. parseAgentAbility expects just the effect
  // portion, so strip the leading name line.
  const effectText = abilityText.includes('\n')
    ? abilityText.split('\n').slice(1).join('\n')
    : abilityText
  const effects = parseAgentAbility(effectText)
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

function getLeader(game, player) {
  return game.state.leaders[player.name] || null
}

module.exports = {
  selectLeaders,
  assignLeader,
  resolveSignetRing,
  getLeader,
}
