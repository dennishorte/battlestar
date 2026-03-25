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
  onPlay(game, _player) {
    game.cardState(this.id).stored = 4
  },
  matches_onWorkPhaseStart(game, player) {
    return game.isLastInTurnOrder(player) && (game.cardState(this.id).stored || 0) > 0
  },
  onWorkPhaseStart(game, player) {
    const s = game.cardState(this.id)
    s.stored--
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food',
      args: { player },
    })
  },
}
