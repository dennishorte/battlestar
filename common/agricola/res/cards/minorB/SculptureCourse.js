module.exports = {
  id: "sculpture-course-b053",
  name: "Sculpture Course",
  deck: "minorB",
  number: 53,
  type: "minor",
  cost: { grain: 1 },
  category: "Food Provider",
  text: "At the end of each round that does not end with a harvest, you can use this card to exchange either 1 wood for 2 food, or 1 stone for 4 food.",
  onRoundEnd(game, player, round) {
    if (!game.isHarvestRound(round) && (player.wood >= 1 || player.stone >= 1)) {
      game.actions.offerSculptureCourse(player, this)
    }
  },
}
