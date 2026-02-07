module.exports = {
  id: "childless-b114",
  name: "Childless",
  deck: "occupationB",
  number: 114,
  type: "occupation",
  players: "1+",
  text: "At the start of each round, if you have at least 3 rooms but only 2 people, you get 1 food and 1 crop of your choice (grain or vegetable.)",
  onRoundStart(game, player) {
    if (player.getRoomCount() >= 3 && player.getFamilySize() === 2) {
      player.addResource('food', 1)
      game.actions.offerResourceChoice(player, this, ['grain', 'vegetables'])
    }
  },
}
