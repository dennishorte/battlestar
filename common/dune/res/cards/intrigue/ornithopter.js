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
    // Objectives count as Conflict cards for this effect (designer ruling).
    if (!game.state.conflict.flippedCardIds) {
      game.state.conflict.flippedCardIds = {}
    }
    const flipped = new Set(game.state.conflict.flippedCardIds[player.name] || [])
    const wonCards = game.state.conflict.wonCards?.[player.name] || []
    const objective = game.state.objectives?.[player.name]
    const candidates = objective ? [...wonCards, objective] : [...wonCards]
    const flippable = candidates.filter(c =>
      !flipped.has(c.id) && (c.battleIcon === 'ornithopter' || c.battleIcon === 'wild')
    )
    if (flippable.length > 0) {
      flipped.add(flippable[0].id)
      game.state.conflict.flippedCardIds[player.name] = [...flipped]
      player.incrementCounter('vp', 1, { silent: true, source: 'Ornithopter (intrigue)' })
      game.log.add({ template: '{player}: Flips Ornithopter icon — +1 VP', args: { player } })
    }
  },


  plotEffects: [
    {
      type: 'gain',
      resource: 'spice',
      amount: 1
    }
  ],
}
