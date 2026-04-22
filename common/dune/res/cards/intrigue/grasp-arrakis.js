'use strict'

module.exports = {
  id: "grasp-arrakis",
  name: "Grasp Arrakis",
  source: "Bloodlines",
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
  plotEffect: null,
  combatEffect: "+3 Swords",

  endgameEffect(game, player) {
    // Flip two conflict cards -> +1 VP
    const wonCards = game.state.conflict.wonCards?.[player.name] || []
    if (wonCards.length >= 2) {
      player.incrementCounter('vp', 1, { silent: true })
      game.log.add({ template: '{player}: Flips 2 conflict cards — +1 VP', args: { player } })
    }
  },

}
