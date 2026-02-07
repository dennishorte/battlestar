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
      game.actions.offerBakeBread(player, this)
    }
    else if (actionId === 'take-vegetables') {
      game.actions.offerSow(player, this)
    }
  },
}
