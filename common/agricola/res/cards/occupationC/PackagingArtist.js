module.exports = {
  id: "packaging-artist-c140",
  name: "Packaging Artist",
  deck: "occupationC",
  number: 140,
  type: "occupation",
  players: "3+",
  text: "When you play this card, you immediately get 1 grain. Each time you get a \"Minor Improvement\" action, you can take a \"Bake Bread\" action instead.",
  onPlay(game, player) {
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 1 grain from Packaging Artist',
      args: { player },
    })
  },
  onMinorImprovementAction(game, player) {
    game.actions.offerPackagingArtistChoice(player, this)
  },
}
