module.exports = {
  id: "grain-thief-e112",
  name: "Grain Thief",
  deck: "occupationE",
  number: 112,
  type: "occupation",
  players: "1+",
  text: "Each time you would harvest a grain field, you can leave the grain on the field and take 1 grain from the general supply instead.",
  onHarvestGrainField(game, player) {
    game.actions.offerGrainThiefChoice(player, this)
  },
}
