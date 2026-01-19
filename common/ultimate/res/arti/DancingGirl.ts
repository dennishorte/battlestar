import util from '../../../lib/util.js'
import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Dancing Girl`,
  color: `yellow`,
  age: 1,
  expansion: `arti`,
  biscuits: `hsss`,
  dogmaBiscuit: `s`,
  dogma: [
    `I compel you to transfer Dancing Girl to your board! If you do, transfer all of your highest top cards to my board!`,
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const self = game.cards.byId('Dancing Girl')
      game.actions.transfer(player, self, game.zones.byPlayer(player, self.color))

      const age = game.getHighestTopAge(player)
      const toTransfer = game
        .cards
        .tops(player)
        .filter(card => card.getAge() == age)

      while (toTransfer.length > 0) {
        const card = game.actions.chooseCard(player, toTransfer, {
          title: `Choose a card to transfer to ${leader.name}`,
        })

        game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
        util.array.remove(toTransfer, card)
      }

    }
  ],
} satisfies AgeCardData
