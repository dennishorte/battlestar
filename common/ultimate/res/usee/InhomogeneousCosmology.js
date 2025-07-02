module.exports = {
  name: `Inhomogeneous Cosmology`,
  color: `blue`,
  age: 10,
  expansion: `usee`,
  biscuits: `ihii`,
  dogmaBiscuit: `i`,
  dogma: [
    `You may place a top card from your board on top of its deck. You may meld a card from your hand. If you do either, repeat this effect.`,
    `Draw an {11} for every color not on your board.`
  ],
  dogmaImpl: [
    (game, player) => {
      while (true) {
        const topCards = game.getTopCards(player)
        const handCards = game.getCardsByZone(player, 'hand')

        const topCardChosen = game.actions.chooseCards(player, topCards, { min: 0, max: 1 })[0]
        let topCardReturned
        if (topCardChosen) {
          topCardReturned = game.mMoveCardToTop(topCardChosen, game.getZoneByCardHome(topCardChosen), { player })
        }

        const handCardMelded = game.aChooseAndMeld(player, handCards, { min: 0, max: 1 })[0]

        if (!topCardReturned && !handCardMelded) {
          break
        }
      }
    },
    (game, player, { self }) => {
      const missingColors = game
        .utilColors()
        .filter(color => game.getCardsByZone(player, color).length === 0)

      missingColors.forEach(() => {
        game.aDraw(player, { age: game.getEffectAge(self, 11) })
      })
    }
  ],
}
