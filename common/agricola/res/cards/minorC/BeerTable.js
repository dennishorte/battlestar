module.exports = {
  id: "beer-table-c029",
  name: "Beer Table",
  deck: "minorC",
  number: 29,
  type: "minor",
  cost: { wood: 2 },
  prereqs: { noGrain: true },
  category: "Points Provider",
  text: "At the end of the field phase of each harvest, you can pay 1 grain from your supply to get 2 bonus points. If you do, all other players get 1 food each.",
  onFieldPhaseEnd(game, player) {
    if (player.grain >= 1) {
      const selection = game.actions.choose(player, [
        'Pay 1 grain for 2 bonus points (others get 1 food)',
        'Skip',
      ], {
        title: 'Beer Table',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.payCost({ grain: 1 })
        player.bonusPoints = (player.bonusPoints || 0) + 2
        for (const other of game.players.all()) {
          if (other.name !== player.name) {
            other.addResource('food', 1)
          }
        }
        game.log.add({
          template: '{player} pays 1 grain for 2 bonus points using {card} (others get 1 food)',
          args: { player, card: this },
        })
      }
    }
  },
}
