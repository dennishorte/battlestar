
import util from '../../../lib/util.js'
import type { AgeCardData } from '../../UltimateAgeCard.js'


export default {
  name: `Statistics`,
  color: `yellow`,
  age: 5,
  expansion: `base`,
  biscuits: `lslh`,
  dogmaBiscuit: `l`,
  dogma: [
    `I demand you transfer all the cards of the value of my choice in your score pile to your hand.`,
    `You may splay your yellow cards right.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const ages = game
        .cards.byPlayer(player, 'score')
        .map(card => card.getAge())
      const options = util.array.distinct(ages).sort()

      const value = game.actions.chooseAge(leader, options, { title: 'Age to transfer from score to hand' })

      if (value) {
        const cards = game
          .cards.byPlayer(player, 'score')
          .filter(card => card.getAge() === value)
        game.actions.transferMany(player, cards, game.zones.byPlayer(player, 'hand'), { ordered: true })
      }

    },
    (game, player) => {
      game.actions.chooseAndSplay(player, ['yellow'], 'right')
    }
  ],
} satisfies AgeCardData
