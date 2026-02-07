module.exports = {
  id: "nutrition-expert-b135",
  name: "Nutrition Expert",
  deck: "occupationB",
  number: 135,
  type: "occupation",
  players: "1+",
  text: "At the start of each round, you can exchange a set comprised of 1 animal of any type, 1 grain, and 1 vegetable for 5 food and 2 bonus points.",
  onRoundStart(game, player) {
    if (player.grain >= 1 && player.vegetables >= 1 && player.getTotalAnimals() >= 1) {
      game.actions.offerNutritionExpertExchange(player, this)
    }
  },
}
