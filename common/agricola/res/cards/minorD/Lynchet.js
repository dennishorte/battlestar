module.exports = {
  id: "lynchet-d063",
  name: "Lynchet",
  deck: "minorD",
  number: 63,
  type: "minor",
  cost: {},
  category: "Food Provider",
  text: "In the field phase of each harvest, you get 1 food for each harvested field tile that is orthogonally adjacent to your house.",
  matches_onHarvest(_game, player) {
    return player.getHarvestedFieldsAdjacentToHouse() > 0
  },
  onHarvest(game, player) {
    const adjacentHarvestedFields = player.getHarvestedFieldsAdjacentToHouse()
    player.addResource('food', adjacentHarvestedFields)
    game.log.add({
      template: '{player} gets {amount} food',
      args: { player, amount: adjacentHarvestedFields },
    })
  },
}
