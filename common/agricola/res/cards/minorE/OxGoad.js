module.exports = {
  id: "ox-goad-e019",
  name: "Ox Goad",
  deck: "minorE",
  number: 19,
  type: "minor",
  cost: { wood: 1 },
  vps: 1,
  prereqs: { occupations: 3 },
  text: "Each time after you use the \"Cattle Market\" accumulation space, you can pay 2 food to plow 1 field.",
  onAction(game, player, actionId) {
    if (actionId === 'cattle-market' && player.food >= 2) {
      game.actions.offerPlowForFood(player, this, 2)
    }
  },
}
