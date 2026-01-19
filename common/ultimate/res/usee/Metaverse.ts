export default {
  name: `Metaverse`,
  color: `purple`,
  age: 11,
  expansion: `usee`,
  biscuits: `spph`,
  dogmaBiscuit: `p`,
  dogma: [
    `For each splayed color on your board, score its top card. If you score fewer than three cards, you lose.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const topSplayedCards = game
        .cards.tops(player)
        .filter(c => game.checkColorIsSplayed(player, c.color))

      const scored = game.actions.scoreMany(player, topSplayedCards)

      if (scored.length < 3) {
        game.log.add({
          template: '{player} scored fewer than three cards and loses the game!',
          args: { player }
        })
        game.aYouLose(player, self)
      }
    },
  ],
}
