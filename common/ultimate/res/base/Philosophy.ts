export default {
  name: `Philosophy`,
  color: `purple`,
  age: 2,
  expansion: `base`,
  biscuits: `hsss`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may splay left any one color of your cards.`,
    `You may score a card from your hand.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.chooseAndSplay(player, null, 'left')
    },
    (game, player) => {
      const choices = game
        .zones.byPlayer(player, 'hand')
        .cardlist()
        .map(c => c.name)

      game.actions.chooseAndScore(player, choices, { min: 0, max: 1 })
    }
  ],
}
