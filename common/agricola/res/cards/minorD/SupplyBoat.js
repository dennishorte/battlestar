module.exports = {
  id: "supply-boat-d073",
  name: "Supply Boat",
  deck: "minorD",
  number: 73,
  type: "minor",
  cost: { wood: 1 },
  vps: 1,
  prereqs: { occupations: 1 },
  category: "Crop Provider",
  text: "Each time after you use the \"Fishing\" accumulation space, you can choose to buy 1 grain for 1 food, or 1 vegetable for 3 food.",
  onAction(game, player, actionId) {
    if (actionId === 'fishing' && player.food >= 1) {
      game.actions.offerSupplyBoat(player, this)
    }
  },
}
