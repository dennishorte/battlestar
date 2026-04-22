'use strict'

module.exports = {
  name: 'Liet Kynes',
  source: 'Bloodlines',
  compatibility: 'Uprising',
  house: null,
  startingEffect: null,
  leaderAbility: 'Arrakis Planetologist\n· Ignore the Influence requirement of Sietch Tabr\n· You summon no sandworms\n· For each one you would, instead: Trash 1 card, +1 Spice, +1 Intrigue\n(even when the Conflict is protected by the Shield Wall)',
  signetRingAbility: 'Judge of the Change\nIf you sent an Agent this turn to:\n· Green space + 2 Emperor Influence → +1 Water\n· Purple space → +1 Solari\n· Yellow space → +1 Spice',
  complexity: 3,

  resolveSignetRing(game, player, resolveEffectFn) {
    const icon = game.state.turnTracking?.spaceIcon
    game.log.indent()
    if (icon === 'green' && player.getInfluence('emperor') >= 2) {
      resolveEffectFn(game, player, { type: 'gain', resource: 'water', amount: 1 }, null)
    }
    if (icon === 'purple') {
      resolveEffectFn(game, player, { type: 'gain', resource: 'solari', amount: 1 }, null)
    }
    if (icon === 'yellow') {
      resolveEffectFn(game, player, { type: 'gain', resource: 'spice', amount: 1 }, null)
    }
    if (!['green', 'purple', 'yellow'].includes(icon)) {
      game.log.add({ template: 'No matching space color for Judge of the Change', event: 'memo' })
    }
    game.log.outdent()
  },
}
