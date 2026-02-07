module.exports = {
  id: "barrow-pusher-a105",
  name: "Barrow Pusher",
  deck: "occupationA",
  number: 105,
  type: "occupation",
  players: "1+",
  text: "For each new field tile you get, you also get 1 clay and 1 food.",
  onPlowField(game, player) {
    player.addResource('clay', 1)
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 clay and 1 food from Barrow Pusher',
      args: { player },
    })
  },
}
