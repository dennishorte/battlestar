module.exports = {
  id: "childless-b114",
  name: "Childless",
  deck: "occupationB",
  number: 114,
  type: "occupation",
  players: "1+",
  text: "At the start of each round, if you have at least 3 rooms but only 2 people, you get 1 food and 1 crop of your choice (grain or vegetable.)",
  matches_onRoundStart(_game, player) {
    return player.getRoomCount() >= 3 && player.getFamilySize() === 2
  },
  onRoundStart(game, player) {
    player.addResource('food', 1)
    game.actions.offerResourceChoice(player, this, ['grain', 'vegetables'])
  },
}
