module.exports = {
  id: "lumber-pile-e076",
  name: "Lumber Pile",
  deck: "minorE",
  number: 76,
  type: "minor",
  cost: {},
  text: "When you play this card, you can immediately return up to 3 stables from your farmyard board to your supply and get 3 wood for each.",
  onPlay(game, player) {
    const stables = player.getStableSpaces()
    if (stables.length === 0) {
      return
    }
    const maxReturn = Math.min(3, stables.length)
    const choices = []
    for (let i = 1; i <= maxReturn; i++) {
      choices.push(`Return ${i} stable${i > 1 ? 's' : ''} for ${i * 3} wood`)
    }
    choices.push('Skip')
    const selection = game.actions.choose(player, choices, {
      title: 'Lumber Pile',
      min: 1,
      max: 1,
    })
    if (selection[0] !== 'Skip') {
      const count = parseInt(selection[0].split(' ')[1])
      for (let i = 0; i < count; i++) {
        player.farmyard.grid[stables[i].row][stables[i].col].hasStable = false
      }
      player.addResource('wood', count * 3)
      game.log.add({
        template: '{player} returns {count} stable(s) for {wood} wood using {card}',
        args: { player, count, wood: count * 3, card: this },
      })
    }
  },
}
