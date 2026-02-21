module.exports = {
  id: "trimmer-b124",
  name: "Trimmer",
  deck: "occupationB",
  number: 124,
  type: "occupation",
  players: "1+",
  text: "Each time after you enclose at least one farmyard space, you get 2 stone. (Subdividing an existing pasture does not count.)",
  onBuildPasture(game, player) {
    player.addResource('stone', 2)
    game.log.add({
      template: '{player} gets 2 stone from {card}',
      args: { player , card: this},
    })
  },
}
