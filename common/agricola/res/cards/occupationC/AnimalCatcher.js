module.exports = {
  id: "animal-catcher-c168",
  name: "Animal Catcher",
  deck: "occupationC",
  number: 168,
  type: "occupation",
  players: "4+",
  text: "Each time you use the \"Day Laborer\" action space, instead of 2 food, you can get 3 different animals from the general supply. If you do, you must pay 1 food each harvest left to play.",
  onActionReplace(game, player, actionId) {
    if (actionId !== 'day-laborer') {
      return
    }
    // Day Laborer already gave 2 food. "Instead of" means we undo that.
    // Player currently has originalFood + 2. We need (originalFood + 2) - 2 >= harvestsLeft
    // i.e. player.food - 2 >= harvestsLeft
    const harvestRounds = [4, 7, 9, 11, 13, 14]
    const harvestsLeft = harvestRounds.filter(r => r >= game.state.round).length
    if (player.food - 2 >= harvestsLeft
        && player.canPlaceAnimals('sheep', 1)
        && player.canPlaceAnimals('boar', 1)
        && player.canPlaceAnimals('cattle', 1)) {
      const selection = game.actions.choose(player, () => [
        `Pay ${harvestsLeft} food for 1 sheep, 1 boar, 1 cattle`,
        'Do not catch animals',
      ], { title: 'Animal Catcher', min: 1, max: 1 })
      if (selection[0] !== 'Do not catch animals') {
        // Undo Day Laborer's 2 food
        player.removeResource('food', 2)
        player.payCost({ food: harvestsLeft })
        game.actions.handleAnimalPlacement(player, { sheep: 1, boar: 1, cattle: 1 })
        game.log.add({
          template: '{player} pays {food} food for 3 animals from {card}',
          args: { player, food: harvestsLeft, card: this },
        })
      }
    }
  },
}
