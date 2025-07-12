module.exports = {
  name: `Masonry`,
  color: `yellow`,
  age: 1,
  expansion: `base`,
  biscuits: `khkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `You may meld any number of cards from your hand, each with a {k}.`,
    `If you have exactly three red cards on your board, claim the Monument achievement.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.checkHasBiscuit('k'))
      const cards = game.actions.chooseCards(player, choices, { min: 0, max: choices.length })
      if (cards) {
        game.aMeldMany(player, cards)
      }
    },

    (game, player) => {
      const redCards = game.cards.byPlayer(player, 'red')

      if (redCards.length === 3 && game.checkAchievementAvailable('Monument')) {
        game.aClaimAchievement(player, { name: 'Monument' })
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
}
