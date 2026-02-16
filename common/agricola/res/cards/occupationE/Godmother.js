module.exports = {
  id: "godmother-e113",
  name: "Godmother",
  deck: "occupationE",
  number: 113,
  type: "occupation",
  players: "1+",
  text: "Each time you take a \"Family Growth\" action, you also get 1 vegetable.",
  afterFamilyGrowth(game, player) {
    player.addResource('vegetables', 1)
    game.log.add({
      template: '{player} gets 1 vegetable from Godmother',
      args: { player },
    })
  },
}
