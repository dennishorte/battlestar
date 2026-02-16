module.exports = {
  id: "seed-servant-e115",
  name: "Seed Servant",
  deck: "occupationE",
  number: 115,
  type: "occupation",
  players: "1+",
  text: "Each time after you use the \"Grain Seeds\" or \"Vegetable Seeds\" action space, you can take a \"Bake bread\" or \"Sow\" action, respectively.",
  onAction(game, player, actionId) {
    if (actionId === 'take-grain') {
      // Offer bake bread
      if (player.hasBakingAbility() && player.grain >= 1) {
        game.actions.bakeBread(player)
      }
    }
    else if (actionId === 'take-vegetable') {
      // Offer sow
      if (player.canSowAnything()) {
        game.actions.sow(player)
      }
    }
  },
}
