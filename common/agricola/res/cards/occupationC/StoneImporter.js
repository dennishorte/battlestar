module.exports = {
  id: "stone-importer-c124",
  name: "Stone Importer",
  deck: "occupationC",
  number: 124,
  type: "occupation",
  players: "1+",
  text: "In the breeding phase of the 1st/2nd/3rd/4th/5th/6th harvest, you can use this card to buy exactly 2 stone for 2/2/3/3/4/1 food.",
  onBreedingPhaseEnd(game, player) {
    const harvestRounds = [4, 7, 9, 11, 13, 14]
    const harvestNumber = harvestRounds.indexOf(game.state.round) + 1
    const costs = { 1: 2, 2: 2, 3: 3, 4: 3, 5: 4, 6: 1 }
    const cost = costs[harvestNumber]
    if (cost && player.food >= cost) {
      const selection = game.actions.choose(player, () => [
        `Buy 2 stone for ${cost} food`,
        'Skip',
      ], { title: 'Stone Importer', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        player.payCost({ food: cost })
        player.addResource('stone', 2)
        game.log.add({
          template: '{player} buys 2 stone for {cost} food from {card}',
          args: { player, cost , card: this},
        })
      }
    }
  },
}
