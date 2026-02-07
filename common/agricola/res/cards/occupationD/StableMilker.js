module.exports = {
  id: "stable-milker-d166",
  name: "Stable Milker",
  deck: "occupationD",
  number: 166,
  type: "occupation",
  players: "1+",
  text: "Each time you build at least 2 stables on the same turn, you also get 1 cattle.",
  onBuildStables(game, player, stableCount) {
    if (stableCount >= 2 && player.canPlaceAnimals('cattle', 1)) {
      player.addAnimals('cattle', 1)
      game.log.add({
        template: '{player} gets 1 cattle from Stable Milker',
        args: { player },
      })
    }
  },
}
