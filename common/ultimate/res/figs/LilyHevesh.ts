import util from '../../../lib/util.js'
import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Lily Hevesh`,  // Card names are unique in Innovation
  name: `Lily Hevesh`,
  color: `purple`,
  age: 11,
  expansion: `figs`,
  biscuits: `pphb`,
  dogmaBiscuit: `p`,
  karma: [
    `If you would take a Draw action, instead reveal the top card of five decks, one at a time. If you reveal five colors, you win. Otherwise, draw one of the revealed cards, and splay aslant a color on your board.`
  ],
  karmaImpl: [
    {
      trigger: 'draw-action',
      kind: 'would-instead',
      matches: () => true,
      func: (game, player, { self }) => {
        const revealed = []
        for (let i = 0; i < 5; i++) {
          const decks = game
            .getExpansionList()
            .flatMap(exp => game.getAges().map(age => ({ exp, age })))
            .filter(({ exp, age }) => {
              const deck = game.cards.byDeck(exp, age)
              return deck && deck.length > 0
            })
            .map(({ exp, age }) => `${exp} ${age}`)

          const chosenDeckCode = game.actions.choose(player, decks, { title: 'Choose a deck' })[0]
          if (chosenDeckCode) {
            const [exp, ageString] = chosenDeckCode.split(' ')
            const age = parseInt(ageString)
            const card = game.cards.byDeck(exp, age)[0]
            game.actions.reveal(player, card)
            revealed.push(card)
          }

        }

        const revealedColors = revealed.map(card => card.color)
        const distinctColors = util.array.distinct(revealedColors)

        if (distinctColors.length === 5) {
          game.youWin(player, self.name)
        }
        else {
          const toDraw = game.actions.chooseCard(player, revealed)
          game.actions.draw(player, { exp: toDraw.expansion, age: toDraw.getAge() })

          game.actions.chooseAndSplay(player, game.util.colors(), 'aslant')
        }
      }
    }
  ]
} satisfies AgeCardData
