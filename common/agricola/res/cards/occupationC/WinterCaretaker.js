module.exports = {
  id: "winter-caretaker-c113",
  name: "Winter Caretaker",
  deck: "occupationC",
  number: 113,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 grain. At the end of each harvest, you can buy exactly 1 vegetable for 2 food.",
  onPlay(game, player) {
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 1 grain from Winter Caretaker',
      args: { player },
    })
  },
  onHarvestEnd(game, player) {
    if (player.food >= 2) {
      game.actions.offerBuyVegetable(player, this, 2)
    }
  },
}
