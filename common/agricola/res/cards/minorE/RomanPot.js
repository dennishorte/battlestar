module.exports = {
  id: "roman-pot-e056",
  name: "Roman Pot",
  deck: "minorE",
  number: 56,
  type: "minor",
  cost: { clay: 1 },
  vps: 1,
  text: "Place 4 food from the general supply on this card. At the start of each work phase, if you are the last player in turn order, move 1 food from this card to your supply.",
  storedResource: "food",
  onPlay(_game, _player) {
    this.stored = 4
  },
  onWorkPhaseStart(game, player) {
    if (game.isLastInTurnOrder(player) && (this.stored || 0) > 0) {
      this.stored--
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Roman Pot',
        args: { player },
      })
    }
  },
}
