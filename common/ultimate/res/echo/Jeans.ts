import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Jeans`,
  color: `green`,
  age: 7,
  expansion: `echo`,
  biscuits: `&lh8`,
  dogmaBiscuit: `l`,
  echo: [`Draw two {8}. Return one, foreshadow the other.`],
  dogma: [
    `Draw two cards of value equal to your top blue card. Meld one, and return the other.`,
    `Choose the {7} or {8} deck. Junk all cards in that deck.`,
    `If Jeans was foreseen, transfer a valued card in the junk to your hand.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const topCard = game.cards.top(player, 'blue')
      const age = topCard ? topCard.getAge() : 1
      const cards = [
        game.actions.draw(player, { age }),
        game.actions.draw(player, { age }),
      ]

      const toMeld = game.actions.chooseCard(player, cards)
      const other = cards.filter(card => card !== toMeld)[0]

      game.actions.meld(player, toMeld)
      game.actions.return(player, other)
    },

    (game, player, { self }) => {
      const ages = [
        game.getEffectAge(self, 7),
        game.getEffectAge(self, 8),
      ]
      game.actions.chooseAndJunkDeck(player, ages, { count: 1 })
    },

    (game, player, { foreseen, self }) => {
      game.log.addForeseen(foreseen, self)
      if (foreseen) {
        const card = game.actions.chooseCard(player, game.cards.byZone('junk'))
        if (card) {
          game.actions.transfer(player, card, game.zones.byPlayer(player, 'hand'))
        }

      }
    },
  ],
  echoImpl: [
    (game, player, { self }) => {
      const cards = [
        game.actions.draw(player, { age: game.getEffectAge(self, 8) }),
        game.actions.draw(player, { age: game.getEffectAge(self, 8) }),
      ].filter(card => card !== undefined)

      const toReturn = game.actions.chooseCard(player, cards, { title: 'Choose a card to return' })

      if (toReturn) {
        game.actions.return(player, toReturn)
        cards.splice(cards.indexOf(toReturn), 1)
      }

      if (cards.length > 0) {
        game.actions.foreshadow(player, cards[0])
      }
    }
  ],
} satisfies AgeCardData
