module.exports = {
  id: "pumpernickel-e007",
  name: "Pumpernickel",
  deck: "minorE",
  number: 7,
  type: "minor",
  cost: { grain: 1 },
  text: "You immediately get 4 food.",
  onPlay(game, player) {
    player.addResource('food', 4)
    game.log.add({
      template: '{player} gets 4 food from Pumpernickel',
      args: { player },
    })
  },
}
