import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Climatology`,
  color: `blue`,
  age: 11,
  expansion: `base`,
  biscuits: `lhll`,
  dogmaBiscuit: `l`,
  dogma: [
    `I demand you return two top cards from your board each with the icon of my choice other than {l}!`,
    `Return a top card on your board. Return all cards in your score pile of equal or higher value than the returned card.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const validIcons = game
        .util
        .biscuitNames()
        .filter(b => b !== 'leaf')
      const iconName = game.actions.choose(leader, validIcons, { title: 'Choose an icon' })[0]
      const icon = game.util.biscuitNameToIcon(iconName)

      game.log.add({
        template: '{leader} chooses {icon}',
        args: { leader, icon }

      })

      const choices = game
        .cards.tops(player)
        .filter(card => card.checkHasBiscuit(icon))

      game.actions.chooseAndReturn(player, choices, { count: 2, ordered: true })
    },

    (game, player) => {
      const topCards = game.cards.tops(player)
      const card = game.actions.chooseCard(player, topCards)
      if (card) {
        game.actions.return(player, card)

        const returnedValue = card.getAge()
        const scoreCardsToReturn = game
          .cards.byPlayer(player, 'score')
          .filter(c => c.getAge() >= returnedValue)

        game.actions.returnMany(player, scoreCardsToReturn, { ordered: true })
      }
    }
  ],
} satisfies AgeCardData
