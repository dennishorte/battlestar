'use strict'

module.exports = {
  name: 'Duke Leto Atreides',
  source: 'Base',
  compatibility: 'All',
  house: 'Atreides',
  startingEffect: null,
  leaderAbility: 'Landsraad Popularity\nSending an Agent to a Green board space costs you 1 Solari less.',
  signetRingAbility: 'Prudent Diplomacy\nPay 1 Spice:\n· +1 Influence with a Faction where an opponent has more than you',
  complexity: 2,

  resolveSignetRing(game, player, _resolveEffectFn) {
    const constants = require('../constants.js')
    const factions = require('../../systems/factions.js')

    const opponents = game.players.all().filter(p => p.name !== player.name)
    const eligibleFactions = player.spice >= 1
      ? constants.FACTIONS.filter(f => opponents.some(op => op.getInfluence(f) > player.getInfluence(f)))
      : []

    if (eligibleFactions.length === 0) {
      game.log.add({ template: 'Prudent Diplomacy — no eligible faction to gain Influence with', event: 'memo' })
      return
    }

    const choices = [
      game.actions.option({ id: 'pass', title: 'Pass' }),
      ...eligibleFactions.map(f => game.actions.option({ id: f, title: f, kind: 'faction' })),
    ]
    const [factionChoice] = game.actions.choose(player, choices, {
      title: 'Prudent Diplomacy: Pay 1 Spice for +1 Influence?',
    })
    const faction = typeof factionChoice === 'object' ? factionChoice.id : factionChoice

    if (faction === 'pass') {
      game.log.add({
        template: '{player}: Prudent Diplomacy — declined',
        args: { player },
      })
      return
    }

    player.decrementCounter('spice', 1, { silent: true })
    factions.gainInfluence(game, player, faction)
    game.log.add({
      template: '{player}: Prudent Diplomacy — pays 1 Spice, +1 Influence with {faction}',
      args: { player, faction },
    })
  },

  modifySpaceCost(game, player, space, baseCost) {
    if (space.icon === 'green' && baseCost.solari) {
      return { ...baseCost, solari: Math.max(0, baseCost.solari - 1) }
    }
    return baseCost
  },
}
