'use strict'

module.exports = {
  id: 'gene-locked-vault',
  name: 'Gene-Locked Vault',
  source: 'Bloodlines',
  compatibility: 'Rise of Ix',
  spiceCost: 2,
  acquisitionBonus: '· +1 Intrigue card\n· Draw 1 card',
  effect: 'Your intrigue cards can\'t be stolen unless you have 5+',
  hasShipping: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  vpsAvailable: 0,

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'intrigue', amount: 1 }, null, card.name)
    resolveEffect(game, player, { type: 'draw', amount: 1 }, null, card.name)
  },
}
