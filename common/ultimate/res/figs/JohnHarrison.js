module.exports = {
  id: `John Harrison`,  // Card names are unique in Innovation
  name: `John Harrison`,
  color: `green`,
  age: 6,
  expansion: `figs`,
  biscuits: `6ch*`,
  dogmaBiscuit: `c`,
  echo: ``,
  karma: [
    `You may issue a Trade Decree with any two figures.`,
    `If an opponent would draw a card for sharing, first draw a {6}. You may choose the type of card drawn.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Trade'
    },
    {
      trigger: 'draw',
      triggerAll: true,
      kind: 'would-first',
      matches: (game, player, { share }) => {
        const owner = game.getPlayerByCard(this)
        const isOpponentCondition = game.players.opponents(owner).includes(player)
        return isOpponentCondition && share
      },
      func: (game, player) => {
        const owner = game.getPlayerByCard(this)
        const kind = game.actions.choose(owner, game.getExpansionList())[0]
        game.actions.draw(owner, { exp: kind, age: game.getEffectAge(this, 6) })
      }
    }
  ]
}
