export default {
  name: `Shrapnel`,
  color: `red`,
  age: 6,
  expansion: `echo`,
  biscuits: `fffh`,
  dogmaBiscuit: `f`,
  echo: [],
  dogma: [
    `I demand you draw and tuck a {6}! Transfer the top two cards of its color from your board to my score pile! Score the bottom card of its color on my board.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const card = game.actions.drawAndTuck(player, game.getEffectAge(self, 6))
      if (card) {
        const toTransfer = game
          .cards
          .byPlayer(player, card.color)
          .slice(0, 2)
        game.actions.transferMany(player, toTransfer, game.zones.byPlayer(leader, 'score'), { ordered: true })

        const toScore = game
          .cards
          .byPlayer(leader, card.color)
          .slice(-1)
        game.actions.scoreMany(player, toScore)
      }
    }
  ],
  echoImpl: [],
}
