import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
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

        if (colors.length > 0) {
          choices.push({
            title: other.name,
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
        const color = selected.selection[0]

        game.actions.unsplay(other, color)
      }
    },

    (game, player) => {
      const choices = [
        'Safeguard achievements',
        'Achieve secrets'
      ]

      const choice = game.actions.choose(player, choices)[0]

      if (choice === choices[0]) {
        // Safeguard achievements
        const available = game.getAvailableStandardAchievements(player)

        const max = Math.min(available.length, game.getSafeOpenings(player))
        game.actions.chooseAndSafeguard(player, available, {
          title: 'Choose achievements to safeguard',
          min: 0,
          max,
          hidden: true,
        })
      }
      else if (choice === choices[1]) {
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
} satisfies AgeCardData
