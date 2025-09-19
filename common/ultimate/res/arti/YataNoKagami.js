module.exports = {
  name: `Yata No Kagami`,
  color: `blue`,
  age: 3,
  expansion: `arti`,
  biscuits: `shsk`,
  dogmaBiscuit: `s`,
  dogma: [
    `Reveal a card from your hand. If you do, splay left its color on your board, then choose a top card other than Yata No Kagami of that color on any board and self-execute it.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const revealed = game.actions.chooseAndReveal(player, game.cards.byPlayer(player, 'hand'))[0]
      if (revealed) {
        game.actions.splay(player, revealed.color, 'left')

        const choices = game
          .players
          .all()
          .map(player => game.cards.top(player, revealed.color))
          .filter(card => Boolean(card))
          .filter(card => card.id !== self.id)

        const toSelfExecute = game.actions.chooseCard(player, choices)
        if (toSelfExecute) {
          game.aSelfExecute(player, toSelfExecute)
        }
      }
    }
  ],
}
