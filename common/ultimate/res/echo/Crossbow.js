module.exports = {
  name: `Crossbow`,
  color: `red`,
  age: 2,
  expansion: `echo`,
  biscuits: `3hkk`,
  dogmaBiscuit: `k`,
  echo: [],
  dogma: [
    `I demand you transfer an expansion from your hand to my score pile!`,
    `Transfer a card from your hand to any other player's board.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.checkIsExpansion())
      game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(leader, 'score'))
    },

    (game, player) => {
      const otherChoices = game
        .getPlayerAll()
        .filter(other => other !== player)
      const other = game.aChoosePlayer(player, otherChoices)
      const card = game.aChooseCard(player, game.getCardsByZone(player, 'hand'))
      if (card) {
        game.aTransfer(player, card, game.getZoneByPlayer(other, card.color))
      }
    },
  ],
  echoImpl: [],
}
