module.exports = {
  name: `Terracotta Army`,
  color: `yellow`,
  age: 2,
  expansion: `arti`,
  biscuits: `ccch`,
  dogmaBiscuit: `c`,
  dogma: [
    `I compel you to return a top card with no {k}!`,
    `Score a card from your hand with no {k}.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .getTopCards(player)
        .filter(card => !card.checkHasBiscuit('k'))
      game.actions.chooseAndReturn(player, choices)
    },
    (game, player) => {
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => !card.checkHasBiscuit('k'))
      game.actions.chooseAndScore(player, choices)
    }
  ],
}
