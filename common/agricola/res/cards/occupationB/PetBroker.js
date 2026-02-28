module.exports = {
  id: "pet-broker-b148",
  name: "Pet Broker",
  deck: "occupationB",
  number: 148,
  type: "occupation",
  players: "3+",
  text: "When you play this card, you immediately get 1 sheep. You can keep 1 sheep on each occupation in front of you.",
  holdsAnimals: { sheep: true },
  onPlay(game, player) {
    if (player.canPlaceAnimals('sheep', 1)) {
      game.actions.handleAnimalPlacement(player, { sheep: 1 })
      game.log.add({
        template: '{player} gets 1 sheep from {card}',
        args: { player , card: this},
      })
    }
  },
  getAnimalCapacity(_game, player) {
    return player.getOccupationCount()
  },
}
