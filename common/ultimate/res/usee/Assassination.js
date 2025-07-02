module.exports = {
  name: `Assassination`,
  color: `red`,
  age: 1,
  expansion: `usee`,
  biscuits: `chck`,
  dogmaBiscuit: `c`,
  dogma: [
    `I demand you draw and reveal a {1}. If it has {k}, transfer it and the top card on your board of its color to my score pile!`,
    `If no player has a top green card, claim the Confidence achievement.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(self, 1))

      if (card.checkHasBiscuit('k')) {
        game.aTransfer(player, card, game.getZoneByPlayer(leader, 'score'))
        const topCard = game.getTopCard(player, card.color)
        if (topCard) {
          game.aTransfer(player, topCard, game.getZoneByPlayer(leader, 'score'))
        }
      }
    },

    (game, player) => {
      const topGreenCards = game
        .players.all()
        .map(p => game.getTopCard(p, 'green'))
        .filter(card => Boolean(card))

      if (topGreenCards.length === 0) {
        game.aClaimAchievement(player, { name: 'Confidence' })
      }
    }
  ],
}
