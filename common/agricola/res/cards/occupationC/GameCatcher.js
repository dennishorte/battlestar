module.exports = {
  id: "game-catcher-c165",
  name: "Game Catcher",
  deck: "occupationC",
  number: 165,
  type: "occupation",
  players: "4+",
  text: "When you play this card, pay 1 food for each remaining harvest to immediately get 1 cattle and 1 wild boar.",
  onPlay(game, player) {
    const harvestsLeft = game.getRemainingHarvestCount()
    if (player.food >= harvestsLeft && player.canPlaceAnimals('cattle', 1) && player.canPlaceAnimals('boar', 1)) {
      player.removeResource('food', harvestsLeft)
      player.addAnimals('cattle', 1)
      player.addAnimals('boar', 1)
      game.log.add({
        template: '{player} pays {food} food for 1 cattle and 1 wild boar from Game Catcher',
        args: { player, food: harvestsLeft },
      })
    }
  },
}
