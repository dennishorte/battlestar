
const util = require('../../../lib/util.js')

module.exports = {
  name: `Toothbrush`,
  color: `yellow`,
  age: 2,
  expansion: `echo`,
  biscuits: `2&hl`,
  dogmaBiscuit: `l`,
  echo: [`Tuck all cards of one present value from your hand.`],
  dogma: [
    `You may splay any one color of your cards left.`,
    `You may junk all cards in the {2} deck. If you do, achieve the highest card in the junk, if eligible.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.aChooseAndSplay(player, null, 'left')
    },

    (game, player) => {
      const deckAge = game.getEffectAge(this, 2)
      const junked = game.aJunkDeck(player, deckAge, { optional: true })
      if (junked) {
        const junk = game.zones.byId('junk').cardlist()
        const choices = game
          .utilHighestCards(junk)
          .filter(card => game.checkAchievementEligibility(player, card))
        game.aChooseAndAchieve(player, choices, { hidden: true })
      }
    }
  ],
  echoImpl: [
    (game, player) => {
      const ages = game
        .cards.byZone(player, 'hand')
        .map(card => card.getAge())
        .sort()
      const choices = util.array.distinct(ages)
      const age = game.aChooseAge(player, choices)
      if (age) {
        const toTuck = game
          .cards.byZone(player, 'hand')
          .filter(card => card.getAge() === age)
        game.aTuckMany(player, toTuck)
      }
    }
  ],
}
