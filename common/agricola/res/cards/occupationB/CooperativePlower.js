module.exports = {
  id: "cooperative-plower-b090",
  name: "Cooperative Plower",
  deck: "occupationB",
  number: 90,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Farmland\" action space while the \"Grain Seeds\" action space is occupied, you can plow 1 additional field.",
  onAction(game, player, actionId) {
    if (actionId === 'plow-field' && game.isActionOccupied('take-grain')) {
      game.actions.offerPlow(player, this)
    }
  },
}
