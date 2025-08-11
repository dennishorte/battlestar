module.exports = {
  name: `Chintz`,
  color: `green`,
  age: 4,
  expansion: `echo`,
  biscuits: `chc4`,
  dogmaBiscuit: `c`,
  echo: ``,
  dogma: [
    `Draw a {4}.`,
    `If you have exactly one card in your hand, draw a {4}, then draw and score a {4}.`,
    `If Chintz was foreseen, transfer all cards from your hand to the available achievements.`,
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.draw(player, { age: game.getEffectAge(this, 4) })
    },

    (game, player) => {
      if (game.cards.byPlayer(player, 'hand').length === 1) {
        game.actions.draw(player, { age: game.getEffectAge(this, 4) })
        game.actions.drawAndScore(player, game.getEffectAge(this, 4))
      }
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        game.mLogWasForeseen(self)
        const hand = game.cards.byPlayer(player, 'hand')
        game.actions.transferMany(player, hand, game.zones.byId('achievements'), { ordered: true })
      }
    },
  ],
  echoImpl: [],
}
