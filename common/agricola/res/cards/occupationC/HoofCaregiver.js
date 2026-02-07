module.exports = {
  id: "hoof-caregiver-c156",
  name: "Hoof Caregiver",
  deck: "occupationC",
  number: 156,
  type: "occupation",
  players: "4+",
  text: "Immediately add 1 cattle from the general supply to the \"Cattle Market\" accumulation space. Afterward, you get 1 grain plus 1 food for each cattle on \"Cattle Market\".",
  onPlay(game, player) {
    game.addToAccumulationSpace('take-cattle', 'cattle', 1)
    const cattleOnMarket = game.getAccumulatedResources('take-cattle').cattle || 0
    player.addResource('grain', 1)
    player.addResource('food', cattleOnMarket)
    game.log.add({
      template: '{player} gets 1 grain and {food} food from Hoof Caregiver',
      args: { player, food: cattleOnMarket },
    })
  },
}
