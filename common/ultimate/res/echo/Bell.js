module.exports = {
  name: `Bell`,
  color: `purple`,
  age: 1,
  expansion: `echo`,
  biscuits: `kmk&`,
  dogmaBiscuit: `k`,
  echo: `You may score a card from your hand.`,
  dogma: [
    `Draw and foreshadow a {1} and a {2}.`,
    `If Bell was foreseen, return all cards from all hands.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.drawAndForeshadow(player, game.getEffectAge(this, 1))
      game.actions.drawAndForeshadow(player, game.getEffectAge(this, 2))
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        const cards = game.getPlayerAll().flatMap(p => game.cards.byPlayer(p, 'hand'))

        game.mLog({ template: 'I do not have a good way to hide only the cards in other player hands, so the game just automatically returns them all.' })
        game.aReturnMany(player, cards, { ordered: true })
      }
      else {
        game.mLogWasForeseen(self)
      }
    },
  ],
  echoImpl: (game, player) => {
    game.actions.chooseAndScore(player, game.cards.byPlayer(player, 'hand'), { min: 0, max: 1 })
  },
}
