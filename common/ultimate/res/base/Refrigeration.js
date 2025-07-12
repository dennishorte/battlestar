module.exports = {
  name: `Refrigeration`,
  color: `yellow`,
  age: 7,
  expansion: `base`,
  biscuits: `hllc`,
  dogmaBiscuit: `l`,
  dogma: [
    `I demand you return all but one card from your hand!`,
    `You may score a card from your hand.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.cards.byPlayer(player, 'hand')
      const count = Math.max(cards.length - 1, 0)
      game.aChooseAndReturn(player, cards, { count })
    },
    (game, player) => {
      game.aChooseAndScore(player, game.cards.byPlayer(player, 'hand'), { min: 0, max: 1 })
    }
  ],
}
