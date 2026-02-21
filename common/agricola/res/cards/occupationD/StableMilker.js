module.exports = {
  id: "stable-milker-d166",
  name: "Stable Milker",
  deck: "occupationD",
  number: 166,
  type: "occupation",
  players: "1+",
  text: "Each time you build at least 2 stables on the same turn, you also get 1 cattle.",
  onBuildStable(game, player) {
    const s = game.cardState(this.id)
    if (s.lastRound !== game.state.round) {
      s.stablesBuilt = 0
      s.lastRound = game.state.round
    }
    s.stablesBuilt++
    if (s.stablesBuilt === 2 && player.canPlaceAnimals('cattle', 1)) {
      player.addAnimals('cattle', 1)
      game.log.add({
        template: '{player} gets 1 cattle from {card}',
        args: { player , card: this},
      })
    }
  },
}
