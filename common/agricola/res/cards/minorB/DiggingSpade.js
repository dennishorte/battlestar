module.exports = {
  id: "digging-spade-b051",
  name: "Digging Spade",
  deck: "minorB",
  number: 51,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { minRound: 7 },
  category: "Food Provider",
  text: "Each time you use a clay accumulation space, you also get a number of food equal to the number of wild boar in your farmyard.",
  onAction(game, player, actionId) {
    if (actionId === 'take-clay' || actionId === 'take-clay-2') {
      const boar = player.getTotalAnimals('boar')
      if (boar > 0) {
        player.addResource('food', boar)
        game.log.add({
          template: '{player} gets {amount} food from Digging Spade',
          args: { player, amount: boar },
        })
      }
    }
  },
}
