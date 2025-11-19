module.exports = {
  name: `Ride-Hailing`,
  color: `yellow`,
  age: 10,
  expansion: `usee`,
  biscuits: `iiih`,
  dogmaBiscuit: `i`,
  dogma: [
    `You may splay your green cards up.`,
    `Meld a top non-yellow card with {i} from another player's board. If you do, self-execute it. Otherwise, draw an {e}.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.chooseAndSplay(player, ['green'], 'up')
    },
    (game, player, { self }) => {
      const choices = game
        .players.other(player)
        .flatMap(opp => game.cards.tops(opp))
        .filter(card => card.color !== 'yellow' && card.checkHasBiscuit('i'))

      const card = game.actions.chooseAndMeld(player, choices)[0]

      if (card) {
        game.aSelfExecute(self, player, card)
      }
      else {
        game.actions.draw(player, { age: game.getEffectAge(self, 11) })
      }
    }
  ],
}
