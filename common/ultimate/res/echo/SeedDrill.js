module.exports = {
  name: `Seed Drill`,
  color: `green`,
  age: 5,
  expansion: `echo`,
  biscuits: `sllh`,
  dogmaBiscuit: `l`,
  echo: [],
  dogma: [
    `I demand you return a top card from your board of value less than 3!`,
    `Choose the {3}, {4}, or {5} deck. You may junk all cards in the chosen deck. If you do, achieve the highest card in the junk, if eligible.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .cards.tops(player)
        .filter(card => card.getAge() < 3)
      game.actions.chooseAndReturn(player, choices)
    },

    (game, player, { self }) => {
      const deckAges = [
        game.getEffectAge(self, 3),
        game.getEffectAge(self, 4),
        game.getEffectAge(self, 5),
      ]
      const didJunk = game.actions.chooseAndJunkDeck(player, deckAges, { min: 0 })
      if (didJunk) {
        const achievable = game
          .util
          .highestCards(game.cards.byZone('junk'))
          .filter(card => game.checkAchievementEligibility(player, card))

        game.actions.chooseAndAchieve(player, achievable)
      }
      else {
        game.log.add({
          template: '{player} chooses not to junk a deck',
          args: { player }
        })
      }
    },
  ],
  echoImpl: [],
}
