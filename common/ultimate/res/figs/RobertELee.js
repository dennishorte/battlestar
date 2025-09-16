module.exports = {
  id: `Robert E. Lee`,  // Card names are unique in Innovation
  name: `Robert E. Lee`,
  color: `red`,
  age: 7,
  expansion: `figs`,
  biscuits: `&hll`,
  dogmaBiscuit: `l`,
  echo: `Transfer a top card with a {l} from anywhere to any player's board.`,
  karma: [
    `You may issue a War Decree with any two figures.`,
    `Each seven {l} on your board counts as an achievement.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const cardChoices = game
      .getTopCardsAll()
      .filter(card => card.checkHasBiscuit('l'))
    const card = game.actions.chooseCard(player, cardChoices)

    if (card) {
      const targetPlayer = game.actions.choosePlayer(player, game.getPlayerAll())
      const target = game.getZoneByPlayer(targetPlayer, card.color)

      game.aTransfer(player, card, target)
    }
  },
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'extra-achievements',
      func: (game, player) => {
        const leafBiscuits = game.getBiscuitsByPlayer(player).l
        return Math.floor(leafBiscuits / 7)
      }
    }
  ]
}
