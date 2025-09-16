const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  id: `Emperor Meiji`,  // Card names are unique in Innovation
  name: `Emperor Meiji`,
  color: `purple`,
  age: 7,
  expansion: `figs`,
  biscuits: `hii*`,
  dogmaBiscuit: `i`,
  echo: ``,
  karma: [
    `If you would meld a card of value 10 and you have top cards of values 9 and 8 on your board, instead you win.`,
    `Each card in your forecast counts as being in your hand.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        const cardCondition = card.getAge() === 10
        const nineCondition = game
          .getTopCards(player)
          .filter(card => card.getAge() === 9)
          .length > 0
        const eightCondition = game
          .getTopCards(player)
          .filter(card => card.getAge() === 8)
          .length > 0
        return cardCondition && nineCondition && eightCondition
      },
      func: (game, player) => {
        throw new GameOverEvent({
          player,
          reason: 'Emperor Meiji'
        })
      }
    },

    {
      trigger: 'list-hand',
      func: (game, player) => {
        return [
          ...game.getZoneByPlayer(player, 'hand')._cards,
          ...game.getZoneByPlayer(player, 'forecast')._cards,
        ]
      }
    }
  ]
}
