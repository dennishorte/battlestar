module.exports = {
  id: "sower-c115",
  name: "Sower",
  deck: "occupationC",
  number: 115,
  type: "occupation",
  players: "1+",
  text: "Each time you build a major improvement, place 1 reed from the general supply on that card. At any time, you can move the reed to your supply or exchange it for a \"Sow\" action.",
  allowsAnytimeAction: true,
  onBuildMajor(game, player, majorId) {
    if (!game.state.sowerReed) {
      game.state.sowerReed = {}
    }
    game.state.sowerReed[majorId] = (game.state.sowerReed[majorId] || 0) + 1
  },
}
