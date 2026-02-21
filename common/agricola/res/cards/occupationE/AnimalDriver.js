module.exports = {
  id: "animal-driver-e147",
  name: "Animal Driver",
  deck: "occupationE",
  number: 147,
  type: "occupation",
  players: "1+",
  text: "At the start of each harvest, if you have 1/2/3+ fenced stables, you get 1 sheep/wild boar/cattle.",
  onHarvestStart(game, player) {
    const fencedStables = player.getFencedStableCount()
    if (fencedStables >= 3 && player.canPlaceAnimals('cattle', 1)) {
      player.addAnimals('cattle', 1)
      game.log.add({
        template: '{player} gets 1 cattle from {card}',
        args: { player , card: this},
      })
    }
    else if (fencedStables >= 2 && player.canPlaceAnimals('boar', 1)) {
      player.addAnimals('boar', 1)
      game.log.add({
        template: '{player} gets 1 wild boar from {card}',
        args: { player , card: this},
      })
    }
    else if (fencedStables >= 1 && player.canPlaceAnimals('sheep', 1)) {
      player.addAnimals('sheep', 1)
      game.log.add({
        template: '{player} gets 1 sheep from {card}',
        args: { player , card: this},
      })
    }
  },
}
