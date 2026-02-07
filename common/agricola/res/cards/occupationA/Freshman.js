module.exports = {
  id: "freshman-a097",
  name: "Freshman",
  deck: "occupationA",
  number: 97,
  type: "occupation",
  players: "1+",
  text: "Each time you get a \"Bake Bread\" action, instead of taking the action, you can play an occupation without paying an occupation cost.",
  onBakeBreadAction(game, player) {
    game.actions.offerFreshmanChoice(player, this)
  },
}
