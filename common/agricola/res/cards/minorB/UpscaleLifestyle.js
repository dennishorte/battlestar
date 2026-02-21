module.exports = {
  id: "upscale-lifestyle-b001",
  name: "Upscale Lifestyle",
  deck: "minorB",
  number: 1,
  type: "minor",
  cost: { wood: 3 },
  category: "Farm Planner",
  text: "You immediately get 5 clay and a \"Renovation\" action. If you take the action, you must pay the renovation cost.",
  onPlay(game, player) {
    player.addResource('clay', 5)
    game.log.add({
      template: '{player} gets 5 clay from {card}',
      args: { player , card: this},
    })
    game.actions.offerRenovation(player, this)
  },
}
