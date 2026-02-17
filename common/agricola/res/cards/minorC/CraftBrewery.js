module.exports = {
  id: "craft-brewery-c063",
  name: "Craft Brewery",
  deck: "minorC",
  number: 63,
  type: "minor",
  cost: { wood: 2, clay: 1 },
  category: "Food Provider",
  text: "In the feeding phase of each harvest, you can use this card to exchange 1 grain from your supply plus 1 grain from a field for 2 bonus points and 4 food.",
  onFeedingPhase(game, player) {
    if (player.grain >= 1 && player.getGrainFieldCount() > 0) {
      const selection = game.actions.choose(player, [
        'Exchange 1 grain (supply) + 1 grain (field) for 4 food and 2 bonus points',
        'Skip',
      ], {
        title: 'Craft Brewery',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        // Pay 1 grain from supply
        player.payCost({ grain: 1 })
        // Remove 1 grain from a grain field (reduce cropCount by 1)
        let removed = false
        for (const row of player.farmyard.grid) {
          for (const space of row) {
            if (space.type === 'field' && space.crop === 'grain' && space.cropCount > 0) {
              space.cropCount--
              if (space.cropCount === 0) {
                space.crop = null
              }
              removed = true
              break
            }
          }
          if (removed) {
            break
          }
        }
        player.addResource('food', 4)
        player.addBonusPoints(2)
        game.log.add({
          template: '{player} exchanges grain for 4 food and 2 bonus points using {card}',
          args: { player, card: this },
        })
      }
    }
  },
}
