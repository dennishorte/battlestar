module.exports = {
  id: "iron-hoe-e020",
  name: "Iron Hoe",
  deck: "minorE",
  number: 20,
  type: "minor",
  cost: { wood: 1 },
  text: "At the end of each work phase, if you occupy both the \"Grain Seeds\" and \"Vegetable Seeds\" action spaces, you can plow 1 field.",
  onWorkPhaseEnd(game, player) {
    if (game.playerOccupiesAction(player, 'grain-seeds') &&
          game.playerOccupiesAction(player, 'vegetable-seeds')) {
      game.actions.offerFreePlow(player, this)
    }
  },
}
