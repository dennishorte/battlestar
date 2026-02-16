module.exports = {
  id: "site-manager-d095",
  name: "Site Manager",
  deck: "occupationD",
  number: 95,
  type: "occupation",
  players: "1+",
  text: "When you play this card, immediately build a major improvement. When paying its cost, you can replace up to 1 building resource of each type with 1 food each.",
  onPlay(game, player) {
    game.actions.buyImprovement(player, true, false)
  },
}
