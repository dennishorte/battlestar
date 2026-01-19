export default {
  name: `Octant`,
  color: `red`,
  age: 5,
  expansion: `echo`,
  biscuits: `cchc`,
  dogmaBiscuit: `c`,
  echo: ``,
  dogma: [
    `I demand you transfer your top card with a {l} or {f} of each non-red color from your board to my board! If you do, and Octant wasn't foreseen, draw and foreshadow a {6}!`,
    `Draw and foreshadow a {6}.`
  ],
  dogmaImpl: [
    (game, player, { foreseen, leader, self }) => {
      const toTransfer = game
        .cards
        .tops(player)
        .filter(card => card.color !== 'red')
        .filter(card => card.checkHasBiscuit('l') || card.checkHasBiscuit('f'))
      const transferred = game.actions.transferMany(player, toTransfer, { player: leader, toBoard: true })

      if (transferred.length > 0) {
        game.log.addForeseen(foreseen, self)
        if (!foreseen) {
          game.actions.drawAndForeshadow(player, game.getEffectAge(self, 6))
        }
      }
    },

    (game, player, { self }) => {
      game.actions.drawAndForeshadow(player, game.getEffectAge(self, 6))
    },
  ],
  echoImpl: [],
}
