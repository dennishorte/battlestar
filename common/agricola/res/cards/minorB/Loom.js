module.exports = {
  id: "loom-b039",
  name: "Loom",
  deck: "minorB",
  number: 39,
  type: "minor",
  cost: { wood: 2 },
  vps: 1,
  prereqs: { occupations: 2 },
  category: "Points Provider",
  text: "In the field phase of each harvest, if you have at least 1/4/7 sheep, you get 1/2/3 food. During scoring, you get 1 bonus point for every 3 sheep.",
  onHarvest(game, player) {
    const sheep = player.getTotalAnimals('sheep')
    let food = 0
    if (sheep >= 7) {
      food = 3
    }
    else if (sheep >= 4) {
      food = 2
    }
    else if (sheep >= 1) {
      food = 1
    }

    if (food > 0) {
      player.addResource('food', food)
      game.log.add({
        template: '{player} gets {amount} food from Loom',
        args: { player, amount: food },
      })
    }
  },
  getEndGamePoints(player) {
    const sheep = player.getTotalAnimals('sheep')
    return Math.floor(sheep / 3)
  },
}
