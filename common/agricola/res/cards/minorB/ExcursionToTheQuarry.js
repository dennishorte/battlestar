module.exports = {
  id: "excursion-to-the-quarry-b006",
  name: "Excursion to the Quarry",
  deck: "minorB",
  number: 6,
  type: "minor",
  cost: { food: 2 },
  prereqs: { occupations: 1 },
  category: "Building Resource Provider",
  text: "You immediately get a number of stone equal to the number of people you have.",
  onPlay(game, player) {
    const people = player.familyMembers
    if (people > 0) {
      player.addResource('stone', people)
      game.log.add({
        template: '{player} gets {amount} stone from {card}',
        args: { player, amount: people , card: this},
      })
    }
  },
}
