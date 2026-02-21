module.exports = {
  id: "boar-spear-e053",
  name: "Boar Spear",
  deck: "minorE",
  number: 53,
  type: "minor",
  cost: { wood: 1, stone: 1 },
  vps: 1,
  text: "Each time you get at least 1 wild boar outside of the breeding phase of a harvest, you can immediately turn them into 4 food each.",
  onTakeAnimals(game, player, animalType, count) {
    if (animalType === 'boar' && count > 0) {
      // Cap at actual boar the player has (some may have been released during overflow)
      const actualBoar = Math.min(count, player.getTotalAnimals('boar'))
      if (actualBoar === 0) {
        return
      }

      const foodGain = actualBoar * 4
      const selection = game.actions.choose(player, [
        `Convert ${actualBoar} boar to ${foodGain} food`,
        'Keep boar',
      ], { title: 'Boar Spear', min: 1, max: 1 })
      if (selection[0] !== 'Keep boar') {
        // Remove the boar that were just placed and give food instead
        player.removeAnimals('boar', actualBoar)
        player.addResource('food', foodGain)
        game.log.add({
          template: '{player} converts {count} boar to {food} food via {card}',
          args: { player, count: actualBoar, food: foodGain , card: this},
        })
      }
    }
  },
}
