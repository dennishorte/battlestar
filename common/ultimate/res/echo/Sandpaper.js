module.exports = {
  name: `Sandpaper`,
  color: `yellow`,
  age: 3,
  expansion: `echo`,
  biscuits: `cchl`,
  dogmaBiscuit: `c`,
  echo: [],
  dogma: [
    `You may return any number of cards from your hand. Draw a {3} for each card you return.`,
    `Meld a card from your hand.`,
    `If Sandpaper was foreseen, foreshadow all cards in your hand.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const returned = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'), {
        min: 0,
        max: 999
      })

      for (let i = 0; i < returned.length; i++) {
        game.actions.draw(player, { age: game.getEffectAge(self, 3) })
      }
    },

    (game, player) => {
      game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'hand'))
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        game.log.addForeseen(self)
        game.actions.foreshadowMany(player, game.cards.byPlayer(player, 'hand'))
      }
    },
  ],
  echoImpl: [],
}
