module.exports = {
  id: "master-huntsman-e165",
  name: "Master Huntsman",
  deck: "occupationE",
  number: 165,
  type: "occupation",
  players: "1+",
  text: "When you play this card and each time you build a major improvement, you get 1 wild boar.",
  onPlay(game, player) {
    if (player.canPlaceAnimals('boar', 1)) {
      player.addAnimals('boar', 1)
      game.log.add({
        template: '{player} gets 1 wild boar from {card}',
        args: { player , card: this},
      })
    }
  },
  onBuildMajor(game, player) {
    if (player.canPlaceAnimals('boar', 1)) {
      player.addAnimals('boar', 1)
      game.log.add({
        template: '{player} gets 1 wild boar from {card}',
        args: { player , card: this},
      })
    }
  },
}
