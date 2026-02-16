module.exports = {
  id: "midnight-fencer-e149",
  name: "Midnight Fencer",
  deck: "occupationE",
  number: 149,
  type: "occupation",
  players: "1+",
  text: "At the start of the last harvest, you can take up to 2 of each other player's unbuilt fences and build them on your farm at no cost. (Your farm can then have over 15 fences.)",
  onHarvestStart(game, player) {
    if (game.getHarvestNumber() === 6) {
      // Steal unbuilt fences from opponents
      let stolenTotal = 0
      for (const opponent of game.getPlayers()) {
        if (opponent === player) {
          continue
        }
        const unbuilt = opponent.getFencesInSupply()
        if (unbuilt <= 0) {
          continue
        }
        const canSteal = Math.min(2, unbuilt)
        const choices = []
        for (let i = canSteal; i >= 1; i--) {
          choices.push(`Take ${i} fence${i > 1 ? 's' : ''} from ${opponent.name}`)
        }
        choices.push('Skip')
        const selection = game.actions.choose(player, choices, {
          title: `Midnight Fencer: Steal fences from ${opponent.name}?`,
          min: 1,
          max: 1,
        })
        if (selection[0] !== 'Skip') {
          const count = parseInt(selection[0].match(/Take (\d+)/)[1])
          for (let i = 0; i < count; i++) {
            opponent.useFenceFromSupply()
          }
          stolenTotal += count
          game.log.add({
            template: '{player} steals {count} fence(s) from {opponent} using Midnight Fencer',
            args: { player, count, opponent },
          })
        }
      }
      if (stolenTotal > 0) {
        // Build stolen fences for free
        game.actions.buildFences(player, { free: true, extraFences: stolenTotal })
      }
    }
  },
}
