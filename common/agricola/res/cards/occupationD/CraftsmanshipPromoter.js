module.exports = {
  id: "craftsmanship-promoter-d131",
  name: "Craftsmanship Promoter",
  deck: "occupationD",
  number: 131,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 stone. You can build any of the major improvements in the bottom row of the supply board even when taking a \"Minor Improvement\" action.",
  allowsMajorOnMinorAction: true,
  allowedMajors: ["joinery", "pottery", "basketmakers-workshop"],
  onPlay(game, player) {
    player.addResource('stone', 1)
    game.log.add({
      template: '{player} gets 1 stone from Craftsmanship Promoter',
      args: { player },
    })
  },
}
