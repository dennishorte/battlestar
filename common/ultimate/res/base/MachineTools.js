module.exports = {
  name: `Machine Tools`,
  color: `red`,
  age: 6,
  expansion: `base`,
  biscuits: `ffhf`,
  dogmaBiscuit: `f`,
  dogma: [
    `Draw and score a card of value equal to the highest card in your score pile.`
  ],
  dogmaImpl: [
    (game, player) => {
      const age = game
        .cards.byPlayer(player, 'score')
        .reduce((l, r) => Math.max(l, r.getAge()), 0)
      game.actions.drawAndScore(player, age)
    }
  ],
}
