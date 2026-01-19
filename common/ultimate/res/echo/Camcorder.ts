import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Camcorder`,
  color: `red`,
  age: 10,
  expansion: `echo`,
  biscuits: `hiif`,
  dogmaBiscuit: `i`,
  echo: ``,
  dogma: [
    `I demand you transfer all cards in your hand to my hand! Draw a {9}!`,
    `Meld all {9} from your hand. If Camcorder wasn't foreseen, return all other cards from your hand, and draw three {9}.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      game.actions.transferMany(player, game.cards.byPlayer(player, 'hand'), game.zones.byPlayer(leader, 'hand'))
      game.actions.draw(player, { age: game.getEffectAge(self, 9) })
    },

    (game, player, { foreseen, self }) => {
      game.log.addForeseen(foreseen, self)

      if (!foreseen) {
        const toMeld = game
          .cards
          .byPlayer(player, 'hand')
          .filter(card => card.getAge() === game.getEffectAge(self, 9))
        game.actions.meldMany(player, toMeld)
        game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))
        game.actions.draw(player, { age: game.getEffectAge(self, 9) })
        game.actions.draw(player, { age: game.getEffectAge(self, 9) })
        game.actions.draw(player, { age: game.getEffectAge(self, 9) })
      }

    }
  ],
  echoImpl: [],
} satisfies AgeCardData
