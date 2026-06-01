module.exports = {
  name: `Dark Web`,
  color: `red`,
  age: 11,
  expansion: `usee`,
  biscuits: `fhii`,
  dogmaBiscuit: `i`,
  dogma: [
    `Unsplay any color on any board.`,
    `Choose to either safeguard any number of available standard achievements, or achieve any number of secrets from your safe regardless of eligibility.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = []

      for (const other of game.players.startingWith(player)) {
        const colors = game
          .util.colors()
          .filter(color => game.zones.byPlayer(other, color).splay !== 'none')
          .map(c => game.actions.option({ id: c, title: c, kind: 'color' }))

        if (colors.length > 0) {
          choices.push({
            title: other.name,
            id: other.name,
            choices: colors,
            min: 0
          })
        }
      }

      const selected = game.actions.choose(player, choices, {
        title: 'Choose a color to unsplay',
      })[0]

      if (selected) {
        const otherName = selected.title
        const other = game.players.byName(otherName)
        const inner = selected.selection[0]
        const color = (inner && typeof inner === 'object') ? inner.id : inner

        game.actions.unsplay(other, color)
      }
    },

    (game, player) => {
      const choices = [
        game.actions.option({ id: 'safeguard-achievements', title: 'Safeguard achievements' }),
        game.actions.option({ id: 'achieve-secrets', title: 'Achieve secrets' }),
      ]

      const pick = game.actions.choose(player, choices)[0]
      const choice = (pick && typeof pick === 'object') ? pick.id : pick

      if (choice === 'safeguard-achievements' || choice === 'Safeguard achievements') {
        // Safeguard achievements
        const available = player.availableStandardAchievements()

        const max = Math.min(available.length, player.safeOpenings())
        game.actions.chooseAndSafeguard(player, available, {
          title: 'Choose achievements to safeguard',
          min: 0,
          max,
          hidden: true,
        })
      }
      else if (choice === 'achieve-secrets' || choice === 'Achieve secrets') {
        // Achieve secrets
        const secrets = game.cards.byPlayer(player, 'safe')
        const toAchieve = game.actions.chooseCards(player, secrets, {
          title: 'Choose secrets to achieve',
          min: 0,
          max: secrets.length,
          hidden: true,
        })

        toAchieve.forEach(card => {
          game.actions.claimAchievement(player, card)
        })
      }
    },
  ],
}
