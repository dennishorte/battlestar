module.exports = {
  id: `Alhazen`,  // Card names are unique in Innovation
  name: `Alhazen`,
  color: `blue`,
  age: 3,
  expansion: `figs`,
  biscuits: `ss&h`,
  dogmaBiscuit: `s`,
  echo: `Tuck a top card with a {k} from anywhere.`,
  karma: [
    `Each of your splayed colors counts as having a top card of value equal to the number of {s} or {k} in that color (whichever is higher) for the purpose of taking a Draw or Inspire action.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [
    (game, player) => {
      const topCardsWithCastles = game
        .getPlayerAll()
        .flatMap(p => game.getTopCards(p))
        .filter(card => card.biscuits.includes('k'))

      game.actions.chooseAndTuck(player, topCardsWithCastles)
    }
  ],
  karmaImpl: [
    {
      trigger: 'top-card-value',
      matches(game, player, { action, color }) {
        const actionCondition = action === 'draw' || action === 'inspire'
        const splayCondition = game.getZoneByPlayer(player, color).splay !== 'none'
        return actionCondition && splayCondition
      },
      func(game, player, { color }) {
        const zone = game.getZoneByPlayer(player, color)
        const biscuits = game.getBiscuitsByZone(zone)
        return Math.max(biscuits.k, biscuits.s)
      }
    }
  ]
}
