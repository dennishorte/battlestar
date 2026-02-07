module.exports = {
  id: "working-gloves-e060",
  name: "Working Gloves",
  deck: "minorE",
  number: 60,
  type: "minor",
  cost: {},
  text: "When you play this card, you get 1 food. Each time you pay an occupation cost, you can pay 1 building resource of your choice in place of (up to) 2 food.",
  onPlay(game, player) {
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food from Working Gloves',
      args: { player },
    })
  },
  modifyOccupationCost(game, player, cost) {
    // Allows substitution of 1 building resource for up to 2 food
    return { ...cost, allowResourceSubstitution: { resource: 'building', replaces: 2 } }
  },
}
