module.exports = {
  id: "land-surveyor-e107",
  name: "Land Surveyor",
  deck: "occupationE",
  number: 107,
  type: "occupation",
  players: "1+",
  text: "In the field phase of each harvest, if you have at least 2/4/6/7 fields, you get 1/2/3/4 food.",
  onFieldPhase(game, player) {
    const fields = player.getFieldCount()
    let food = 0
    if (fields >= 7) {
      food = 4
    }
    else if (fields >= 6) {
      food = 3
    }
    else if (fields >= 4) {
      food = 2
    }
    else if (fields >= 2) {
      food = 1
    }
    if (food > 0) {
      player.addResource('food', food)
      game.log.add({
        template: '{player} gets {amount} food from Land Surveyor',
        args: { player, amount: food },
      })
    }
  },
}
