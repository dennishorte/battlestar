module.exports = {
  id: "wild-greens-e050",
  name: "Wild Greens",
  deck: "minorE",
  number: 50,
  type: "minor",
  cost: {},
  text: "Each time you sow, you get 1 food for every different type of good that you sow.",
  onAfterSow(game, player, types) {
    const uniqueTypes = new Set(types).size
    if (uniqueTypes > 0) {
      player.addResource('food', uniqueTypes)
      game.log.add({
        template: '{player} gets {amount} food from Wild Greens',
        args: { player, amount: uniqueTypes },
      })
    }
  },
}
