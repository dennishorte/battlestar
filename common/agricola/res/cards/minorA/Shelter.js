module.exports = {
  id: "shelter-a001",
  name: "Shelter",
  deck: "minorA",
  number: 1,
  type: "minor",
  cost: {},
  category: "Farm Planner",
  text: "You can immediately build a stable at no cost, but only if you place it in a pasture covering exactly 1 farmyard space.",
  onPlay(game, player) {
    const singleSpacePastures = (player.farmyard.pastures || []).filter(p => p.spaces.length === 1 && !player.hasStableAt(p.spaces[0]))
    if (singleSpacePastures.length > 0) {
      const card = this
      const pastures = singleSpacePastures
      const choices = pastures.map(p => `Build stable at ${p.spaces[0].row},${p.spaces[0].col}`)
      choices.push('Skip')

      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Build a free stable?`,
        min: 1,
        max: 1,
      })

      if (selection[0] !== 'Skip') {
        const match = selection[0].match(/(\d+),(\d+)/)
        if (match) {
          const row = parseInt(match[1])
          const col = parseInt(match[2])
          player.buildStable(row, col)
          game.log.add({
            template: '{player} builds a free stable using {card}',
            args: { player, card },
          })
        }
      }
    }
  },
}
