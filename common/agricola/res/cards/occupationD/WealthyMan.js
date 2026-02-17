module.exports = {
  id: "wealthy-man-d153",
  name: "Wealthy Man",
  deck: "occupationD",
  number: 153,
  type: "occupation",
  players: "1+",
  text: "At the start of each of the 1st/2nd/3rd/4th/5th/6th harvest, if you have at least 1/2/3/4/5/6 grain fields, you get 1 bonus point.",
  onHarvestStart(game, player) {
    const harvestNumber = game.getHarvestNumber()
    const grainFields = player.getGrainFieldCount()
    if (grainFields >= harvestNumber) {
      player.addBonusPoints(1)
      game.log.add({
        template: '{player} gets 1 bonus point from Wealthy Man',
        args: { player },
      })
    }
  },
}
