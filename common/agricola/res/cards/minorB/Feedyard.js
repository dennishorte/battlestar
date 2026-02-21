module.exports = {
  id: "feedyard-b011",
  name: "Feedyard",
  deck: "minorB",
  number: 11,
  type: "minor",
  cost: { clay: 1, grain: 1 },
  vps: 1,
  category: "Livestock Provider",
  text: "This card can hold 1 animal for each pasture you have, even different types. After the breeding phase of each harvest, you receive 1 food for each unused spot on this card.",
  holdsAnimalsPerPasture: true,
  onBreedingPhaseEnd(game, player) {
    const capacity = player.getPastureCount()
    const animalsOnCard = player.getCardAnimalTotal(this.id)
    const unused = capacity - animalsOnCard
    if (unused > 0) {
      player.addResource('food', unused)
      game.log.add({
        template: '{player} gets {amount} food from {card}',
        args: { player, amount: unused , card: this},
      })
    }
  },
}
