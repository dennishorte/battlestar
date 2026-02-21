module.exports = {
  id: "butter-churn-b050",
  name: "Butter Churn",
  deck: "minorB",
  number: 50,
  type: "minor",
  cost: { wood: 1 },
  vps: 1,
  prereqs: { occupations: 3, occupationsAtMost: true },
  category: "Food Provider",
  text: "In the field phase of each harvest, you get 1 food for every 3 sheep and 1 food for every 2 cattle you have.",
  onHarvest(game, player) {
    const sheep = player.getTotalAnimals('sheep')
    const cattle = player.getTotalAnimals('cattle')
    const food = Math.floor(sheep / 3) + Math.floor(cattle / 2)
    if (food > 0) {
      player.addResource('food', food)
      game.log.add({
        template: '{player} gets {amount} food from {card}',
        args: { player, amount: food , card: this},
      })
    }
  },
}
