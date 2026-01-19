import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Space Traffic`,
  color: `green`,
  age: 11,
  expansion: `base`,
  biscuits: `ccih`,
  dogmaBiscuit: `c`,
  dogma: [
    `Draw and tuck an {e}. If you tuck directly under an {e}, you lose. Otherwise, score all but your top five cards of the color of the tucked card, splay that color aslant, and if you do not have the highest score, repeat this effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const executeEffect = () => {
        const card = game.actions.drawAndTuck(player, game.getEffectAge(self, 11))
        const color = card.color
        const stack = game.cards.byPlayer(player, color)

        if (stack.length === 1) {
          game.log.add({ template: 'no card above tucked card' })
        }

        else {
          const cardAbove = stack.slice(-2, -1)[0]
          if (cardAbove.getAge() === game.getEffectAge(self, 11)) {
            game.log.add({
              template: '{player} tucked the card just under an 11',
              args: { player },
            })
            game.aYouLose(player, self)
          }
        }

        // Score all but top 5 cards of that color
        const cards = game.cards.byPlayer(player, color)
        if (cards.length > 5) {
          const toScore = cards.slice(5)
          game.actions.scoreMany(player, toScore, { ordered: true })
        }

        // Splay that color aslant
        game.actions.splay(player, color, 'aslant')

        // Check if player doesn't have highest score
        const playerScore = game.getScore(player)
        const highestScore = Math.max(...game.players.all().map(p => game.getScore(p)))

        return playerScore < highestScore
      }

      // First execution
      let shouldRepeat = executeEffect()

      // Repeat if needed
      while (shouldRepeat) {
        game.log.add({
          template: '{player} repeats the effect',
          args: { player }
        })

        shouldRepeat = executeEffect()
      }
    }
  ],
} satisfies AgeCardData
