module.exports = {
  id: "excavator-c126",
  name: "Excavator",
  deck: "occupationC",
  number: 126,
  type: "occupation",
  players: "1+",
  text: "Each time after you use the \"Day Laborer\" action space, you get 1 additional wood and clay, and you can buy 1 stone for 1 food.",
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer') {
      player.addResource('wood', 1)
      player.addResource('clay', 1)
      game.log.add({
        template: '{player} gets 1 wood and 1 clay from Excavator',
        args: { player },
      })
      if (player.food >= 1) {
        game.actions.offerBuyStone(player, this, 1, 1)
      }
    }
  },
}
