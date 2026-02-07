module.exports = {
  id: "pig-breeder-a165",
  name: "Pig Breeder",
  deck: "occupationA",
  number: 165,
  type: "occupation",
  players: "4+",
  text: "When you play this card, you immediately get 1 wild boar. Your wild boar breed at the end of round 12 (if there is room for the new wild boar).",
  onPlay(game, player) {
    if (player.canPlaceAnimals('boar', 1)) {
      player.addAnimals('boar', 1)
      game.log.add({
        template: '{player} gets 1 wild boar from Pig Breeder',
        args: { player },
      })
    }
  },
  onRoundEnd(game, player, round) {
    if (round === 12) {
      const boarCount = player.getTotalAnimals('boar')
      if (boarCount >= 2 && player.canPlaceAnimals('boar', 1)) {
        player.addAnimals('boar', 1)
        game.log.add({
          template: "{player}'s wild boar breed from Pig Breeder",
          args: { player },
        })
      }
    }
  },
}
