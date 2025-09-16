module.exports = {
  id: `Albert Einstein`,  // Card names are unique in Innovation
  name: `Albert Einstein`,
  color: `blue`,
  age: 8,
  expansion: `figs`,
  biscuits: `hs&8`,
  dogmaBiscuit: `s`,
  echo: `Meld all cards from your hand with a {s} or {i}.`,
  karma: [
    `You may issue an Advancement Decree with any two figures.`,
    `Each {} value in any of your effects counts as a {0}.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [
    (game, player) => {
      const cards = game
        .getZoneByPlayer(player, 'hand')
        .cards()
        .filter(card => card.biscuits.includes('s') || card.biscuits.includes('i'))

      game.actions.meldMany(player, cards)
    }
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement'
    },
    {
      trigger: 'effect-age',
      func(game, player, card, age) {
        return 10
      }
    }
  ]
}
