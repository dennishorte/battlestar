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
      template: '{player} gets 1 grain from {card}',
      args: { player , card: this},
    })
  },
  onMinorImprovementAction(game, player) {
    const choices = ['Bake bread instead', 'Play minor improvement normally']
    const selection = game.actions.choose(player, choices, {
      title: 'Packaging Artist: Bake bread instead of minor improvement?',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Bake bread instead') {
      game.actions.bakeBread(player)
      return true // signal that we replaced the action
    }
    return false
  },
}
