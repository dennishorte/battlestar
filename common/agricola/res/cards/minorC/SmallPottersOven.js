module.exports = {
  id: "small-potters-oven-c060",
  name: "Small Potter's Oven",
  deck: "minorC",
  number: 60,
  type: "minor",
  cost: { clay: 2 },
  vps: 5,
  prereqs: {
    returnMajor: ["clay-oven", "stone-oven"],
  },
  category: "Food Provider",
  text: "When you play this card, you immediately get 5 food. Each time before you get a \"Bake Bread\" action, you can build the \"Clay Oven\" or \"Stone Oven\" major improvement.",
  isOven: true,
  onPlay(game, player) {
    player.addResource('food', 5)
    game.log.add({
      template: '{player} gets 5 food from Small Potter\'s Oven',
      args: { player },
    })
  },
  onBeforeBake(game, player) {
    game.actions.offerBuildOven(player, this)
  },
}
