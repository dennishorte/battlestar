module.exports = {
  name: `Email`,
  color: `green`,
  age: 9,
  expansion: `echo`,
  biscuits: `&iih`,
  dogmaBiscuit: `i`,
  echo: `Draw and foreshadow a {0}.`,
  dogma: [
    `Draw and foreshadow a {9}.`,
    `Execute all non-demand dogma effects on your lowest non-green top card. Do not share them.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.drawAndForeshadow(player, game.getEffectAge(this, 9))
    },
    (game, player) => {
      const choices = game
        .util.lowestCards(game.cards.tops(player))
        .filter(card => card.color !== 'green')
      const card = game.actions.chooseCard(player, choices)
      if (card) {
        game.aCardEffects(player, card, 'dogma')
      }
      else {
        game.log.addNoEffect()
      }
    }
  ],
  echoImpl: (game, player) => {
    game.actions.drawAndForeshadow(player, game.getEffectAge(this, 10))
  },
}
