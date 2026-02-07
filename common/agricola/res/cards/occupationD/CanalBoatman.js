module.exports = {
  id: "canal-boatman-d103",
  name: "Canal Boatman",
  deck: "occupationD",
  number: 103,
  type: "occupation",
  players: "1+",
  text: "Each time you use \"Fishing\" or \"Reed Bank\", you can pay 1 food to immediately place another person on this card. If you do, you get your choice of 3 stone or 1 grain plus 1 vegetable.",
  onAction(game, player, actionId) {
    if ((actionId === 'fishing' || actionId === 'reed-bank') && player.food >= 1 && player.hasAvailableWorker()) {
      game.actions.offerCanalBoatmanPlacement(player, this)
    }
  },
}
