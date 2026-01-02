module.exports = {
  id: `Robert E. Lee`,  // Card names are unique in Innovation
  name: `Robert E. Lee`,
  color: `red`,
  age: 7,
  expansion: `figs`,
  biscuits: `phll`,
  dogmaBiscuit: `l`,
  karma: [
    `If a player would dogma a card with a demand effect, first transfer a top card of another color with {l} from anywhere to any player's board.`,
    `Each seven {l} on your board counts as an achievement.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      triggerAll: true,
      kind: 'would-first',
      matches: (game, player, { card }) => card.checkHasDemand(),
      func: (game, player, { card }) => {
        const mayTransfer = game
          .cards
          .topsAll()
          .filter(other => other.color !== card.color)
          .filter(other => other.checkHasBiscuit('l'))

        const toTransfer = game.actions.chooseCard(player, mayTransfer, {
          title: 'Choose a card to transfer',
        })

        if (toTransfer) {
          const transferZoneOptions = game
            .players
            .all()
            .filter(p => p.id !== toTransfer.owner.id)
            .map(p => game.zones.byPlayer(p, toTransfer.color))

          const transferZone = game.actions.chooseZone(player, transferZoneOptions)

          game.actions.transfer(player, toTransfer, transferZone)
        }
      }
    },
    {
      trigger: 'extra-achievements',
      func: (game, player) => {
        const leafBiscuits = player.biscuits().l
        return Math.floor(leafBiscuits / 7)
      }
    }
  ]
}
