module.exports = {
  id: "tasting-b063",
  name: "Tasting",
  deck: "minorB",
  number: 63,
  type: "minor",
  cost: { wood: 2 },
  vps: 1,
  category: "Food Provider",
  text: "Each time you use a \"Lessons\" action space, before you pay the occupation cost, you can exchange 1 grain for 4 food.",
  onLessons(game, player) {
    if (player.grain >= 1) {
      game.actions.offerTasting(player, this)
    }
  },
}
