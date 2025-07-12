module.exports = {
  name: `Translation`,
  color: `blue`,
  age: 3,
  expansion: `base`,
  biscuits: `hccc`,
  dogmaBiscuit: `c`,
  dogma: [
    `You may meld all the cards in your score pile. If you meld one, you must meld them all.`,
    `If each top card on your board has a {c}, claim the World achievement.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.cards.byPlayer(player, 'score')
      if (cards.length === 0) {
        game.log.addNoEffect()
      }
      else {
        const doIt = game.actions.chooseYesNo(player, 'Meld all cards in your score pile?')
        if (doIt) {
          game.aMeldMany(player, game.cards.byPlayer(player, 'score'))
        }
        else {
          game.log.addDoNothing(player)
        }
      }
    },

    (game, player) => {
      const topCards = game.getTopCards(player)
      const topCoins = topCards.filter(card => card.checkHasBiscuit('c'))
      if (topCards.length === topCoins.length) {
        game.aClaimAchievement(player, { name: 'World' })
      }
    },
  ],
}
