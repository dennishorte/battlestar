module.exports = {
  id: "treegardener-a118",
  name: "Treegardener",
  deck: "occupationA",
  number: 118,
  type: "occupation",
  players: "1+",
  text: "In the field phase of each harvest, you get 1 wood and you can buy up to 2 additional wood for 1 food each.",
  onFieldPhase(game, player) {
    player.addResource('wood', 1)
    game.log.add({
      template: '{player} gets 1 wood from Treegardener',
      args: { player },
    })
    if (player.food >= 1) {
      game.actions.offerBuyWood(player, this, 2, 1)
    }
  },
}
