module.exports = {
  id: "braid-maker-e109",
  name: "Braid Maker",
  deck: "occupationE",
  number: 109,
  type: "occupation",
  players: "1+",
  text: "Each harvest, you can use this card to exchange 1 reed for 2 food. You can build the Basketmaker's Workshop for 1 reed and 1 stone even when taking a \"Minor Impr.\" action.",
  allowsMajorOnMinorAction: true,
  allowedMajors: ["basketmakers-workshop"],
  onHarvest(game, player) {
    if (player.reed >= 1) {
      game.actions.offerBraidMakerConversion(player, this)
    }
  },
  modifyMajorCost(player, majorId, cost) {
    if (majorId === 'basketmakers-workshop') {
      return { reed: 1, stone: 1 }
    }
    return cost
  },
}
