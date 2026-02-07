module.exports = {
  id: "livestock-feeder-c086",
  name: "Livestock Feeder",
  deck: "occupationC",
  number: 86,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 grain. Each grain in your supply can hold 1 animal of any type.",
  mixedAnimals: true,
  holdsAnimals: { any: true },
  onPlay(game, player) {
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 1 grain from Livestock Feeder',
      args: { player },
    })
  },
  getAnimalCapacity(player) {
    return player.grain
  },
}
