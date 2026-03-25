module.exports = {
  id: "dung-collector-e090",
  name: "Dung Collector",
  deck: "occupationE",
  number: 90,
  type: "occupation",
  players: "1+",
  text: "Each time you get 2 or more newborn animals, you can pay 1 food to plow 1 field.",
  matches_onBreedingPhaseEnd(game, player, newbornTypes) {
    return newbornTypes >= 2 && (player.food >= 1 || game.getAnytimeFoodConversionOptions(player).length > 0)
  },
  onBreedingPhaseEnd(game, player, _newbornTypes) {
    game.offerPlowForFood(player, this)
  },
}
