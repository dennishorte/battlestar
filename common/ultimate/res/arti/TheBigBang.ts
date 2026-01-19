import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `The Big Bang`,
  color: `purple`,
  age: 9,
  expansion: `arti`,
  biscuits: `shss`,
  dogmaBiscuit: `s`,
  dogma: [
    `Self-execute your top blue card. If this causes any change to occur, draw and junk a {0}, then repeat this effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        game.state.dogmaInfo.theBigBangChange = false

        const card = game.cards.top(player, 'blue')
        if (card) {
          game.aSelfExecute(self, player, card)

          if (game.state.dogmaInfo.theBigBangChange) {
            game.log.add({ template: 'The game state was changed due to the card effects.' })
            const card = game.actions.draw(player, { age: game.getEffectAge(self, 10) })
            game.actions.junk(player, card)
            continue
          }

          else {
            game.log.add({ template: 'No changes due to card effects' })
            break
          }
        }
        else {
          game.log.add({ template: 'No top blue card' })
          break
        }
      }
    }
  ],
} satisfies AgeCardData
