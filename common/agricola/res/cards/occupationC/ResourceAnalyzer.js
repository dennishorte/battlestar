module.exports = {
  id: "resource-analyzer-c157",
  name: "Resource Analyzer",
  deck: "occupationC",
  number: 157,
  type: "occupation",
  players: "4+",
  text: "Before the start of each round, if you have more building resources than all other players of at least two types, you get 1 food.",
  onRoundStart(game, player) {
    const buildingTypes = ['wood', 'clay', 'reed', 'stone']
    let typesLeading = 0
    for (const type of buildingTypes) {
      const myAmount = player[type] || 0
      let leading = true
      for (const other of game.players.all()) {
        if (other.name !== player.name && (other[type] || 0) >= myAmount) {
          leading = false
          break
        }
      }
      if (leading && myAmount > 0) {
        typesLeading++
      }
    }
    if (typesLeading >= 2) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Resource Analyzer',
        args: { player },
      })
    }
  },
}
