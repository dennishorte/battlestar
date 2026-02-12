module.exports = {
  id: "seaweed-fertilizer-c073",
  name: "Seaweed Fertilizer",
  deck: "minorC",
  number: 73,
  type: "minor",
  cost: { food: 2 },
  category: "Crop Provider",
  text: "Each time after you take an unconditional \"Sow\" action, you get 1 grain from the general supply. From round 11 on, you can get 1 vegetable instead.",
  onAfterSow(game, player) {
    if (game.state.round >= 11) {
      const selection = game.actions.choose(player, [
        'Get 1 grain',
        'Get 1 vegetable',
      ], {
        title: 'Seaweed Fertilizer',
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Get 1 vegetable') {
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} gets 1 vegetable from {card}',
          args: { player, card: this },
        })
      }
      else {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from {card}',
          args: { player, card: this },
        })
      }
    }
    else {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from {card}',
        args: { player, card: this },
      })
    }
  },
}
