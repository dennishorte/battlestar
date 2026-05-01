'use strict'

module.exports = {
  id: "ornithopter",
  name: "Ornithopter",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: true,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 1,
  plotEffect: "+1 Spice",
  combatEffect: null,
  endgameText: "Flip one of your face-up Ornithopter or ? Conflict cards → +1 Victory Point",

  endgameEffect(game, player) {
    const wonCards = game.state.conflict.wonCards?.[player.name] || []
    const flipped = new Set(game.state.conflict.flippedCardIds?.[player.name] || [])
    const flippable = wonCards.filter(c =>
      !flipped.has(c.id) && (c.battleIcon === 'ornithopter' || c.battleIcon === 'wild')
    )
    if (flippable.length > 0) {
      flipped.add(flippable[0].id)
      game.state.conflict.flippedCardIds[player.name] = [...flipped]
      player.gainVp(1, 'Ornithopter (intrigue)')
      game.log.add({ template: '{player}: Flips Ornithopter icon — +1 VP', args: { player } })
    }
  },

}
