module.exports = {
  id: "rammed-clay-a016",
  name: "Rammed Clay",
  deck: "minorA",
  number: 16,
  type: "minor",
  cost: {},
  category: "Farm Planner",
  text: "When you play this card, you immediately get 1 clay. You can use clay instead of wood to build fences.",
  onPlay(game, player) {
    player.addResource('clay', 1)
    game.log.add({
      template: '{player} gets 1 clay from Rammed Clay',
      args: { player },
    })
  },
  modifyFenceCost() {
    return { wood: 1, alternateResource: 'clay' }
  },
}
