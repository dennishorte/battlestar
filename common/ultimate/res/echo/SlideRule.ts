import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Slide Rule`,
  color: `blue`,
  age: 4,
  expansion: `echo`,
  biscuits: `sssh`,
  dogmaBiscuit: `s`,
  echo: ``,
  dogma: [
    `You may splay your yellow cards right.`,
    `Draw a card of value equal to the value of your lowest top card plus the number of colors you have splayed.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.chooseAndSplay(player, ['yellow'], 'right')
    },

    (game, player) => {
      const splayedCount = game
        .util.colors()
        .map(color => game.zones.byPlayer(player, color).splay)
        .filter(splay => splay !== 'none')
        .length
      const lowestCard = game.util.lowestCards(game.cards.tops(player))[0]
      const lowestAge = lowestCard ? lowestCard.getAge() : 0
      const drawAge = lowestAge + splayedCount
      game.actions.draw(player, { age: drawAge })
    }

  ],
  echoImpl: [],
} satisfies AgeCardData
