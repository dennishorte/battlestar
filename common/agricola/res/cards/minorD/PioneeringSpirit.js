module.exports = {
  id: "pioneering-spirit-d023",
  name: "Pioneering Spirit",
  deck: "minorD",
  number: 23,
  type: "minor",
  cost: {},
  category: "Actions Booster",
  text: "This card is an action space for you only. In rounds 3-5, it provides a \"Renovation\" action. In rounds 6-8, it provides your choice of 1 vegetable, wild boar, or cattle.",
  providesActionSpace: true,
  ownerOnly: true,
  actionSpaceId: "pioneering-spirit",
  onActionSpaceUsed(game, player) {
    const round = game.state.round
    if (round >= 3 && round <= 5) {
      game.actions.offerRenovation(player, this)
    }
    else if (round >= 6 && round <= 8) {
      game.actions.offerPioneeringSpiritChoice(player, this)
    }
  },
}
