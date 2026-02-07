module.exports = {
  id: "huntsmans-hat-c052",
  name: "Huntsman's Hat",
  deck: "minorC",
  number: 52,
  type: "minor",
  cost: { reed: 1 },
  vps: 1,
  prereqs: { cookingImprovement: true },
  category: "Food Provider",
  text: "For each new wild boar you get from the effect of an action space, you also get 1 food.",
  onGainBoar(game, player, count, fromActionSpace) {
    if (fromActionSpace && count > 0) {
      player.addResource('food', count)
      game.log.add({
        template: '{player} gets {amount} food from Huntsman\'s Hat',
        args: { player, amount: count },
      })
    }
  },
}
