module.exports = {
  id: `Saladin`,  // Card names are unique in Innovation
  name: `Saladin`,
  color: `red`,
  age: 3,
  expansion: `figs`,
  biscuits: `3h&k`,
  dogmaBiscuit: `k`,
  echo: `Score any other top card with a {k} from anywhere.`,
  karma: [
    `You may issue a War Decree with any two figures.`,
    `If you would score a non-figure card, instead meld the card, then you may splay left the color of that card.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const self = game.getCardByName(this.name)
    const choices = game
      .getTopCardsAll()
      .filter(card => card.checkHasBiscuit('k'))
      .filter(card => card !== self)
    game.actions.chooseAndScore(player, choices)
  },
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'score',
      kind: 'would-instead',
      matches: (game, player, { card }) => card.expansion !== 'figs',
      func: (game, player, { card }) => {
        game.aMeld(player, card)
        game.actions.chooseAndSplay(player, [card.color], 'left')
      }
    }
  ]
}
