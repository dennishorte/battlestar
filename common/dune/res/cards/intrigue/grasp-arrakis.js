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
  endgameText: "Flip two of your face-up Conflict cards → +1 Victory Point",

  endgameEffect(game, player) {
    const wonCards = game.state.conflict.wonCards?.[player.name] || []
    const flipped = new Set(game.state.conflict.flippedCardIds?.[player.name] || [])
    const faceUp = wonCards.filter(c => !flipped.has(c.id))
    if (faceUp.length >= 2) {
      flipped.add(faceUp[0].id)
      flipped.add(faceUp[1].id)
      game.state.conflict.flippedCardIds[player.name] = [...flipped]
      player.gainVp(1, 'Grasp Arrakis (intrigue)')
      game.log.add({ template: '{player}: Flips 2 conflict cards — +1 VP', args: { player } })
    }
  },

}
