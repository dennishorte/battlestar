module.exports = {
  id: "potato-digger-c161",
  name: "Potato Digger",
  deck: "occupationC",
  number: 161,
  type: "occupation",
  players: "4+",
  text: "When you play this card, if you have at least 2/4/5 unplanted field tiles, you immediately get 1/2/3 vegetables.",
  onPlay(game, player) {
    const unplantedFields = player.getUnplantedFieldCount()
    let vegetables = 0
    if (unplantedFields >= 5) {
      vegetables = 3
    }
    else if (unplantedFields >= 4) {
      vegetables = 2
    }
    else if (unplantedFields >= 2) {
      vegetables = 1
    }
    if (vegetables > 0) {
      player.addResource('vegetables', vegetables)
      game.log.add({
        template: '{player} gets {amount} vegetables from Potato Digger',
        args: { player, amount: vegetables },
      })
    }
  },
}
