module.exports = {
  id: "young-animal-market-a009",
  name: "Young Animal Market",
  deck: "minorA",
  number: 9,
  type: "minor",
  cost: { sheep: 1 },
  passLeft: true,
  category: "Livestock Provider",
  text: "You immediately get 1 cattle. (Effectively, you are exchanging 1 sheep for 1 cattle.)",
  onPlay(game, player) {
    if (player.canPlaceAnimals('cattle', 1)) {
      player.addAnimals('cattle', 1)
      game.log.add({
        template: '{player} gets 1 cattle from {card}',
        args: { player , card: this},
      })
    }
  },
}
