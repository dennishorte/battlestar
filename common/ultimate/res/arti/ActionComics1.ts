import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Action Comics #1`,
  color: `yellow`,
  age: 8,
  expansion: `arti`,
  biscuits: `hiis`,
  dogmaBiscuit: `i`,
  dogma: [
    `I compel you to draw and reveal an {8}. If it is green, achieve Action Comics #1 if it is a top card. Otherwise, if it has {i}, return it, and if your top card of its color has {i}, transfer it to my achievements, and repeat this effect.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      while (true) {
        const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 8))
        if (card.color === 'green') {
          game.log.add({
            template: '{card} is green',
            args: { card }

          })

          if (self.isTopCardStrict()) {
            game.actions.claimAchievement(player, self)
          }
          else {
            game.log.add({
              template: '{card} is not a top card',
              args: { card: self }
            })
          }
        }

        else {
          game.log.add({
            template: '{card} is not green',
            args: { card }
          })

          if (card.checkHasBiscuit('i')) {
            game.log.add({
              template: '{card} has a clock biscuit',
              args: { card }
            })

            game.actions.return(player, card)

            const topCard = game.cards.top(player, card.color)
            if (topCard && topCard.checkHasBiscuit('i')) {
              game.log.add({
                template: "{player}'s top {color} card has a clock biscuit",
                args: { player, color: card.color }
              })

              game.actions.transfer(player, topCard, game.zones.byPlayer(leader, 'achievements'))
              game.log.add({
                template: 'repeating effect'
              })
              continue
            }
          }
        }

        break
      }
    }
  ],
} satisfies AgeCardData
