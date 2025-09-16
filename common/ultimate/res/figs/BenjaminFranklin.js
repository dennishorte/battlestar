module.exports = {
  id: `Benjamin Franklin`,  // Card names are unique in Innovation
  name: `Benjamin Franklin`,
  color: `blue`,
  age: 6,
  expansion: `figs`,
  biscuits: `s&h6`,
  dogmaBiscuit: `s`,
  echo: `Take a top figure into your hand from any player's board. Meld it.`,
  karma: [
    `You may issue an Advancement Decree with any two figures.`,
    `If you would meld a card, first draw and meld a card of one higher value.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const choices = game
      .getPlayerAll()
      .flatMap(p => game.getTopCards(p))
      .filter(card => card.checkIsFigure())

    const card = game.actions.chooseCard(player, choices)
    if (card) {
      game.log.add({
        template: '{player} takes {card} into their hand',
        args: { player, card }
      })
      game.mMoveCardTo(card, game.getZoneByPlayer(player, 'hand'))
      game.actions.meld(player, card)
    }
  },
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement',
    },
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func(game, player, { card }) {
        game.actions.drawAndMeld(player, card.getAge() + 1)
      }
    }
  ]
}
