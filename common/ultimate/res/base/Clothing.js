module.exports = {
  name: `Clothing`,
  color: `green`,
  age: 1,
  expansion: `base`,
  biscuits: `hcll`,
  dogmaBiscuit: `l`,
  dogma: [
    `Meld a card from your hand of a different color from any card on your board.`,
    `Draw and score a {1} for each color present on your board not present on any opponent's board.`
  ],
  dogmaImpl: [
    (game, player) => {
      const usedColors = game
        .getTopCards(player)
        .map(card => card.color)

      const choices = game
        .zones.byPlayer(player, 'hand')
        .cards()
        .filter(card => !usedColors.includes(card.color))

      game.actions.chooseAndMeld(player, choices)
    },

    (game, player, { self }) => {
      const opponentColors = game
        .players.opponentsOf(player)
        .flatMap(opp => game.getTopCards(opp))
        .map(card => card.color)

      const playerOnlyColors = game
        .getTopCards(player)
        .map(card => card.color)
        .filter(color => !opponentColors.includes(color))
        .length

      if (playerOnlyColors === 0) {
        game.log.addNoEffect()
      }
      else {
        for (let i = 0; i < playerOnlyColors; i++) {
          game.aDrawAndScore(player, game.getEffectAge(self, 1))
        }
      }
    }
  ],
}
