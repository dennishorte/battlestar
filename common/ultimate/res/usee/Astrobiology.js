module.exports = {
  name: `Astrobiology`,
  color: `blue`,
  age: 11,
  expansion: `usee`,
  biscuits: `llph`,
  dogmaBiscuit: `l`,
  dogma: [
    `Return a bottom card from your board. Splay that color on your board aslant. Score all cards on your board of that color without {l}.`
  ],
  dogmaImpl: [
    (game, player) => {
      const bottomCards = game.getBottomCards(player)
      const card = game.aChooseAndReturn(player, bottomCards)[0]

      if (card) {
        game.aSplay(player, card.color, 'aslant')

        const cardsToScore = game
          .getCardsByZone(player, card.color)
          .filter(c => !c.checkHasBiscuit('l'))

        game.aScoreMany(player, cardsToScore)
      }
    },
  ],
}
