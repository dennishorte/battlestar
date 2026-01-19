import { GameOverEvent } from '../../../lib/game.js'
import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Jackie Chan`,  // Card names are unique in Innovation
  name: `Jackie Chan`,
  color: `red`,
  age: 10,
  expansion: `figs`,
  biscuits: `piih`,
  dogmaBiscuit: `i`,
  karma: [
    `If an opponent would win, first score all other top figures anywhere. If you now have the most points, you win instead.`,
    `If you would draw a card, first score a figure from your hand.`
  ],
  karmaImpl: [
    {
      trigger: 'would-win',
      triggerAll: true,
      kind: 'game-over',
      matches: (game, player, { owner }) => player.id !== owner.id,
      func: (game, player, { event, owner, self }) => {
        const topFigures = game
          .players
          .all()
          .flatMap(player => game.cards.tops(player))
          .filter(card => card.checkIsFigure())
          .filter(card => card.id !== self.id)
        game.actions.scoreMany(owner, topFigures)

        const score = game.getScore(owner)
        const others = game
          .players
          .opponents(owner)
          .map(other => game.getScore(other))
        const mostPointsCondition = others.every(otherScore => otherScore < score)
        if (mostPointsCondition) {
          game.log.add({
            template: '{player} now has the most points',
            args: { player: owner }

          })
          return new GameOverEvent({
            player: owner,
            reason: self.name,
          })
        }
        else {
          game.log.add({
            template: '{player} still does not have the most points',
            args: { player: owner }
          })
          return event
        }
      }
    },
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const choices = game
          .cards
          .byPlayer(player, 'hand')
          .filter(card => card.checkIsFigure())
        game.actions.chooseAndScore(player, choices)
      }
    }
  ]
} satisfies AgeCardData
