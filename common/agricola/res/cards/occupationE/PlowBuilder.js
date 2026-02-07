module.exports = {
  id: "plow-builder-e091",
  name: "Plow Builder",
  deck: "occupationE",
  number: 91,
  type: "occupation",
  players: "1+",
  text: "You can build the Joinery when taking a \"Minor Improvement\" action. If you use the Joinery (or an upgrade thereof) during the harvest, you can pay 1 food to plow 1 field.",
  allowsMajorOnMinorAction: true,
  allowedMajors: ["joinery"],
  onUseJoinery(game, player) {
    if (player.food >= 1) {
      game.actions.offerPlowForFood(player, this)
    }
  },
}
