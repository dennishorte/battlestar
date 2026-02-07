module.exports = {
  id: "potato-harvester-c106",
  name: "Potato Harvester",
  deck: "occupationC",
  number: 106,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 3 food. For each vegetable you get from your fields during the field phase of the harvest, you get 1 additional food.",
  onPlay(game, player) {
    player.addResource('food', 3)
    game.log.add({
      template: '{player} gets 3 food from Potato Harvester',
      args: { player },
    })
  },
  onHarvestVegetable(game, player, count) {
    player.addResource('food', count)
    game.log.add({
      template: '{player} gets {count} food from Potato Harvester',
      args: { player, count },
    })
  },
}
