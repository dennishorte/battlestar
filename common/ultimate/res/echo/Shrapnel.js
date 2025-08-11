module.exports = {
  name: `Shrapnel`,
  color: `red`,
  age: 6,
  expansion: `echo`,
  biscuits: `fffh`,
  dogmaBiscuit: `f`,
  echo: [],
  dogma: [
    `I demand you draw and tuck a {6}! Transfer the top two cards of its color from your board to my score pile! Transfer the bottom card of its color from my board to your score pile!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const card = game.actions.drawAndTuck(player, game.getEffectAge(this, 6))
      if (card) {
        const toTransfer = game
          .cards.byPlayer(player, card.color)
          .slice(0, 2)
        game.actions.transferMany(player, toTransfer, game.zones.byPlayer(leader, 'score'), { ordered: true })

        const moreTransfer = game
          .cards.byPlayer(leader, card.color)
          .slice(-1)
        game.actions.transferMany(player, moreTransfer, game.zones.byPlayer(player, 'score'))
      }
    }
  ],
  echoImpl: [],
}
