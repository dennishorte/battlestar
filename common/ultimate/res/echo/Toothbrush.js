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
      game.actions.chooseAndSplay(player, null, 'left')
    },

    (game, player, { self }) => {
      const deckAge = game.getEffectAge(self, 2)
      const junked = game.actions.junkDeck(player, deckAge, { optional: true })
      if (junked) {
        const junk = game.zones.byId('junk').cardlist()
        const choices = game
          .util
          .highestCards(junk)
          .filter(card => player.canClaimAchievement(card))
        game.actions.chooseAndAchieve(player, choices, { hidden: true })
      }
    }
  ],
  echoImpl: [
    (game, player) => {
      const ages = game
        .cards.byPlayer(player, 'hand')
        .map(card => card.getAge())
        .sort()
      const choices = util.array.distinct(ages)
      const age = game.actions.chooseAge(player, choices)
      if (age) {
        const toTuck = game
          .cards.byPlayer(player, 'hand')
          .filter(card => card.getAge() === age)
        game.actions.tuckMany(player, toTuck)
      }
    }
  ],
}
