module.exports = {
  id: "stallwright-e089",
  name: "Stallwright",
  deck: "occupationE",
  number: 89,
  type: "occupation",
  players: "1+",
  text: "After you play your 2nd, 3rd, 5th, and 7th occupation (including this one), you can build 1 stable at no cost.",
  onPlay(game, player) {
    this.checkStable(game, player)
  },
  onPlayOccupation(game, player, playedCard) {
    // Skip if Stallwright itself was just played (onPlay already handled it)
    if (playedCard && playedCard.id === this.id) {
      return
    }
    this.checkStable(game, player)
  },
  checkStable(game, player) {
    const occCount = player.getOccupationCount()
    if ([2, 3, 5, 7].includes(occCount)) {
      // Offer to build a free stable
      const validSpaces = player.getValidStableBuildSpaces()
      if (validSpaces.length === 0) {
        return
      }
      const choices = validSpaces.map(s => `Build stable at ${s.row},${s.col}`)
      choices.push('Skip')
      const selection = game.actions.choose(player, choices, {
        title: `${this.name}: Build a free stable?`,
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
            args: { player, card: this.name },
          })
        }
      }
    }
  },
}
