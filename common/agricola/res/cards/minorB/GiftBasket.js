module.exports = {
  id: "gift-basket-b073",
  name: "Gift Basket",
  deck: "minorB",
  number: 73,
  type: "minor",
  cost: { reed: 1 },
  vps: 1,
  prereqs: { occupations: 3 },
  category: "Crop Provider",
  text: "When you play this card, if you have exactly 2/3/4/5 rooms, you immediately get 1 vegetable/food/grain/vegetable.",
  onPlay(game, player) {
    const rooms = player.getRoomCount()
    if (rooms === 2) {
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 1 vegetable from {card}',
        args: { player , card: this},
      })
    }
    else if (rooms === 3) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card}',
        args: { player , card: this},
      })
    }
    else if (rooms === 4) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from {card}',
        args: { player , card: this},
      })
    }
    else if (rooms === 5) {
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 1 vegetable from {card}',
        args: { player , card: this},
      })
    }
  },
}
