module.exports = {
  name: `Flute`,
  color: `purple`,
  age: 1,
  expansion: `echo`,
  biscuits: `1mc&`,
  dogmaBiscuit: `c`,
  echo: `You may splay one color of your cards left.`,
  dogma: [
    `I demand you return an expansion card from your hand!`,
    `Draw and reveal an Echoes {1}. If it has a bonus, draw a {1}.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.checkIsExpansion())
      game.aChooseAndReturn(player, choices)
    },

    (game, player) => {
      const card = game.actions.drawAndReveal(player, game.getEffectAge(this, 1), { exp: 'echo' })
      if (card && card.checkHasBonus()) {
        game.aDraw(player, { age: game.getEffectAge(this, 1) })
      }
    },
  ],
  echoImpl: (game, player) => {
    game.aChooseAndSplay(player, null, 'left')
  },
}
