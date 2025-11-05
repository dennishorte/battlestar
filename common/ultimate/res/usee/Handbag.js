const util = require('../../../lib/util.js')

module.exports = {
  name: `Handbag`,
  color: `green`,
  age: 8,
  expansion: `usee`,
  biscuits: `hcic`,
  dogmaBiscuit: `c`,
  dogma: [
    `You may choose to either transfer your bottom card of each color to your hand, or tuck all cards from your score pile, or choose a value and score all cards from your hand of that value.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = [
        'Transfer bottom cards to hand',
        'Tuck score pile',
        'Score cards of chosen value from hand'
      ]

      const choice = game.actions.choose(player, choices)[0]

      if (choice === choices[0]) {
        const cards = game.cards.bottoms(player)
        game.actions.transferMany(player, cards, game.zones.byPlayer(player, 'hand'))
      }
      else if (choice === choices[1]) {
        const cards = game.cards.byPlayer(player, 'score')
        game.actions.tuckMany(player, cards)
      }
      else if (choice === choices[2]) {
        const values = game.cards.byPlayer(player, 'hand').map(c => c.getAge())
        const value = game.actions.chooseAge(player, util.array.distinct(values).sort())
        const toScore = game.cards.byPlayer(player, 'hand').filter(c => c.getAge() === value)
        game.actions.scoreMany(player, toScore)
      }
      else {
        throw new Error('Invalid choice: ' + choice)
      }
    },
  ],
}
