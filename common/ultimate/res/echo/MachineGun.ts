import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Machine Gun`,
  color: `red`,
  age: 7,
  expansion: `echo`,
  biscuits: `ff&h`,
  dogmaBiscuit: `f`,
  echo: [`If you have five top cards, draw and score a {7}.`],
  dogma: [
    `I demand you transfer a top card of each color with a bonus from your board to my score pile! If you transfer any, junk 4 available achievements and draw a {7}!`,
    `Return your top card of each non-red color.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const toTransfer = game
        .cards
        .tops(player)
        .filter(card => card.checkHasBonus())
      const transferred = game.actions.transferMany(player, toTransfer, game.zones.byPlayer(leader, 'score'))

      if (transferred.length > 0) {
        const achievements = game.getAvailableAchievements(player)
        game.actions.chooseAndJunk(player, achievements, { count: 4 })
        game.actions.draw(player, { age: game.getEffectAge(self, 7) })
      }

    },

    (game, player) => {
      const toReturn = game
        .cards
        .tops(player)
        .filter(card => card.color !== 'red')
      game.actions.returnMany(player, toReturn)
    }
  ],
  echoImpl: [
    (game, player, { self }) => {
      const topCards = game.cards.tops(player)
      if (topCards.length === 5) {
        game.actions.drawAndScore(player, game.getEffectAge(self, 7))
      }
      else {
        game.log.add({
          template: '{player} does not have five top cards',
          args: { player },
        })
      }
    }
  ],
} satisfies AgeCardData
