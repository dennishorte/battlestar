module.exports = {
  id: "baker-c107",
  name: "Baker",
  deck: "occupationC",
  number: 107,
  type: "occupation",
  players: "1+",
  text: "When you play this card and at the start of each feeding phase, you can take a \"Bake Bread\" action.",
  onPlay(game, player) {
    game.actions.offerBakeBread(player, this)
  },
  onFeedingPhaseStart(game, player) {
    game.actions.offerBakeBread(player, this)
  },
}
