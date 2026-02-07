module.exports = {
  id: "game-trade-d009",
  name: "Game Trade",
  deck: "minorD",
  number: 9,
  type: "minor",
  cost: { sheep: 2 },
  category: "Livestock Provider",
  text: "You immediately get 1 wild boar and 1 cattle. (Effectively, you are exchanging 2 sheep for 1 wild boar and 1 cattle.)",
  onPlay(game, player) {
    player.addAnimal('boar', 1)
    player.addAnimal('cattle', 1)
    game.log.add({
      template: '{player} gets 1 wild boar and 1 cattle from Game Trade',
      args: { player },
    })
  },
}
