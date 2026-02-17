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
  onTakeAnimals(game, player, resource, count, allAccommodated) {
    if (player.specialFoodActive && allAccommodated && count > 0) {
      player.specialFoodActive = false
      player.addBonusPoints(count)
      game.log.add({
        template: '{player} gets {points} bonus points from Special Food',
        args: { player, points: count },
      })
    }
  },
}
