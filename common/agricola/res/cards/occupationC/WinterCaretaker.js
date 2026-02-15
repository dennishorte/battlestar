module.exports = {
  id: "winter-caretaker-c113",
  name: "Winter Caretaker",
  deck: "occupationC",
  number: 113,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 grain. At the end of each harvest, you can buy exactly 1 vegetable for 2 food.",
  onPlay(game, player) {
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 1 grain from Winter Caretaker',
      args: { player },
    })
  },
  onHarvestEnd(game, player) {
    if (player.food >= 2) {
      const choice = game.actions.choose(player, () => [
        'Pay 2 food for 1 vegetable',
        'Do not buy vegetable',
      ], { title: 'Winter Caretaker' })
      if (choice === 'Pay 2 food for 1 vegetable') {
        player.payCost({ food: 2 })
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} buys 1 vegetable for 2 food from Winter Caretaker',
          args: { player },
        })
      }
    }
  },
}
