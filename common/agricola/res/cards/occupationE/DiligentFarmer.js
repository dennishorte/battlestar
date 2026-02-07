module.exports = {
  id: "diligent-farmer-e127",
  name: "Diligent Farmer",
  deck: "occupationE",
  number: 127,
  type: "occupation",
  players: "1+",
  text: "When you play this card, if you would score the maximum 4 points in 3 scoring categories (including fenced stables), you can extend your house by 1 room at no cost.",
  onPlay(game, player) {
    if (player.getCategoriesWithMaxScore() >= 3) {
      game.actions.buildFreeRoom(player, this)
    }
  },
}
