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
    (game, player) => {
      const returned = game.aChooseAndReturn(player, game.cards.byZone(player, 'hand'), {
        min: 0,
        max: 999
      })

      for (let i = 0; i < returned.length; i++) {
        game.aDraw(player, { age: game.getEffectAge(this, 3) })
      }
    },

    (game, player) => {
      game.aChooseAndMeld(player, game.cards.byZone(player, 'hand'))
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        game.mLogWasForeseen(self)
        game.aForeshadowMany(player, game.cards.byZone(player, 'hand'))
      }
    },
  ],
  echoImpl: [],
}
