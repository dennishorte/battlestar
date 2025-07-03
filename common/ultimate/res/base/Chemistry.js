module.exports = {
  name: `Chemistry`,
  color: `blue`,
  age: 5,
  expansion: `base`,
  biscuits: `fsfh`,
  dogmaBiscuit: `f`,
  dogma: [
    `You may splay your blue cards right.`,
    `Draw and score a card of value one higher than the highest top card on your board and then return a card from your score pile.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.aChooseAndSplay(player, ['blue'], 'right')
    },

    (game, player) => {
      const age = game.getHighestTopAge(player) + 1
      game.aDrawAndScore(player, age)
      game.aChooseAndReturn(player, game.getZoneByPlayer(player, 'score').cards())
    }
  ],
}
