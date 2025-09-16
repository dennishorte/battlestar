const util = require('../../../lib/util.js')

module.exports = {
  id: `Carl Friedrich Gauss`,  // Card names are unique in Innovation
  name: `Carl Friedrich Gauss`,
  color: `blue`,
  age: 6,
  expansion: `figs`,
  biscuits: `ss&h`,
  dogmaBiscuit: `s`,
  echo: `Draw a {7}.`,
  karma: [
    `If you would meld a card, first choose a value and meld all other cards of that value from your hand and score pile.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 7) })
  },
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func(game, player, { card }) {
        const age = game.aChooseAge(player)
        const hand = game
          .getCardsByZone(player, 'hand')
          .filter(card => card.getAge() === age)
          .filter(other => other !== card)
        const score = game
          .getCardsByZone(player, 'score')
          .filter(card => card.getAge() === age)

        // Use distinct in case some Karma causes overlap in these two zones.
        const cards = util.array.distinct([...hand, ...score])

        if (cards.length === 0) {
          game.mLogNoEffect()
        }
        else {
          game.aMeldMany(player, cards)
        }
      }
    }
  ]
}
