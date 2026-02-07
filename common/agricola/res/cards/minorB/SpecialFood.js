module.exports = {
  id: "special-food-b034",
  name: "Special Food",
  deck: "minorB",
  number: 34,
  type: "minor",
  cost: {},
  prereqs: { noAnimals: true },
  category: "Points Provider",
  text: "Once this game, the next time you take animals from an accumulation space and accommodate all of them on your farm, you get 1 bonus point for each such animal.",
  onPlay(game, player) {
    player.specialFoodActive = true
  },
  onTakeAnimals(game, player, animalCount, allAccommodated) {
    if (player.specialFoodActive && allAccommodated && animalCount > 0) {
      player.specialFoodActive = false
      player.bonusPoints = (player.bonusPoints || 0) + animalCount
      game.log.add({
        template: '{player} gets {points} bonus points from Special Food',
        args: { player, points: animalCount },
      })
    }
  },
}
