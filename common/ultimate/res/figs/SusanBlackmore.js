module.exports = {
  id: `Susan Blackmore`,  // Card names are unique in Innovation
  name: `Susan Blackmore`,
  color: `blue`,
  age: 10,
  expansion: `figs`,
  biscuits: `*shs`,
  dogmaBiscuit: `s`,
  echo: ``,
  karma: [
    `If another player would not draw a share bonus after a Dogma action, first transfer the card they activated to your score pile.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'no-share',
      triggerAll: true,
      kind: 'would-first',
      matches: (game, player) => {
        return player === game.getPlayerByCard(this)
      },
      func: (game, player, { card }) => {
        game.actions.transfer(player, card, game.getZoneByPlayer(player, 'score'))
      }
    }
  ]
}
