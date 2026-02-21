module.exports = {
  id: "timber-shingle-maker-c132",
  name: "Timber Shingle Maker",
  deck: "occupationC",
  number: 132,
  type: "occupation",
  players: "1+",
  text: "When you renovate to stone, you can place up to 1 wood from your supply in each of your rooms. During scoring, each such wood is worth 1 bonus point.",
  onRenovate(game, player, fromType, toType) {
    if (toType === 'stone' && player.wood > 0) {
      const roomCount = player.getRoomCount()
      const maxWood = Math.min(player.wood, roomCount)
      if (maxWood > 0) {
        const choices = []
        for (let i = 1; i <= maxWood; i++) {
          choices.push(`Place ${i} wood in rooms`)
        }
        choices.push('Skip')
        const selection = game.actions.choose(player, () => choices, { title: 'Timber Shingle Maker', min: 1, max: 1 })
        if (selection[0] !== 'Skip') {
          const amount = parseInt(selection[0].match(/\d+/)[0])
          player.payCost({ wood: amount })
          player.timberShingleMakerWood = (player.timberShingleMakerWood || 0) + amount
          game.log.add({
            template: '{player} places {amount} wood in rooms via {card}',
            args: { player, amount , card: this},
          })
        }
      }
    }
  },
  getEndGamePoints(player) {
    return player.timberShingleMakerWood || 0
  },
}
