module.exports = {
  id: "illusionist-b146",
  name: "Illusionist",
  deck: "occupationB",
  number: 146,
  type: "occupation",
  players: "3+",
  text: "Each time you use a building resource accumulation space, you can discard exactly 1 card from your hand to get 1 additional building resource of the accumulating type.",
  onAction(game, player, actionId) {
    if (game.isBuildingResourceAccumulationSpace(actionId) && player.hand.length > 0) {
      game.actions.offerIllusionistBonus(player, this, actionId)
    }
  },
}
