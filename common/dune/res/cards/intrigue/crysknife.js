'use strict'

module.exports = {
  id: "crysknife",
  name: "Crysknife",
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
  endgameText: "Flip one of your face-up Crysknife or ? Conflict cards → +1 Victory Point",

  endgameEffect(game, player) {
    // Flip a crysknife/wild conflict card -> +1 VP
    const wonCards = game.state.conflict.wonCards?.[player.name] || []
    const flippable = wonCards.filter(c => c.battleIcon === 'blue' || c.battleIcon === 'wild')
    if (flippable.length > 0) {
      player.incrementCounter('vp', 1, { silent: true })
      game.log.add({ template: '{player}: Flips Crysknife icon — +1 VP', args: { player } })
    }
  },

}
