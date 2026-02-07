module.exports = {
  id: "lynchet-d063",
  name: "Lynchet",
  deck: "minorD",
  number: 63,
  type: "minor",
  cost: {},
  category: "Food Provider",
  text: "In the field phase of each harvest, you get 1 food for each harvested field tile that is orthogonally adjacent to your house.",
  onHarvest(game, player) {
    const adjacentHarvestedFields = player.getHarvestedFieldsAdjacentToHouse()
    if (adjacentHarvestedFields > 0) {
      player.addResource('food', adjacentHarvestedFields)
      game.log.add({
        template: '{player} gets {amount} food from Lynchet',
        args: { player, amount: adjacentHarvestedFields },
      })
    }
  },
}
