module.exports = {
  id: "milking-stool-d038",
  name: "Milking Stool",
  deck: "minorD",
  number: 38,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { occupations: 2 },
  category: "Points Provider",
  text: "In the field phase of each harvest, if you have at least 1/3/5 cattle, you get 1/2/3 food. During scoring, you get 1 bonus point for every 2 cattle you have.",
  onHarvest(game, player) {
    const cattle = player.getTotalAnimals('cattle')
    let food = 0
    if (cattle >= 5) {
      food = 3
    }
    else if (cattle >= 3) {
      food = 2
    }
    else if (cattle >= 1) {
      food = 1
    }
    if (food > 0) {
      player.addResource('food', food)
      game.log.add({
        template: '{player} gets {amount} food from Milking Stool',
        args: { player, amount: food },
      })
    }
  },
  getEndGamePoints(player) {
    const cattle = player.getTotalAnimals('cattle')
    return Math.floor(cattle / 2)
  },
}
