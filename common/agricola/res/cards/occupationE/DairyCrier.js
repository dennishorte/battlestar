module.exports = {
  id: "dairy-crier-e167",
  name: "Dairy Crier",
  deck: "occupationE",
  number: 167,
  type: "occupation",
  players: "1+",
  text: "When you play this card, each player (including you) can choose to get 2 sheep or 2 food; you also get 1 cattle.",
  onPlay(game, player) {
    game.actions.offerDairyCrierChoice(game.players.all())
    if (player.canPlaceAnimals('cattle', 1)) {
      player.addAnimals('cattle', 1)
      game.log.add({
        template: '{player} gets 1 cattle from Dairy Crier',
        args: { player },
      })
    }
  },
}
