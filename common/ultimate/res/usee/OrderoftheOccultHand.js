
module.exports = {
  name: `Order of the Occult Hand`,
  color: `purple`,
  age: 10,
  expansion: `usee`,
  biscuits: `hfss`,
  dogmaBiscuit: `s`,
  dogma: [
    `If you have a {3} in your score pile, you lose.`,
    `If you have a {7} in your hand, you win.`,
    `Meld two cards from your hand. Score four cards from your hand. Splay your blue cards up.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const hasAge3 = game
        .cards.byPlayer(player, 'score')
        .some(card => card.getAge() === 3)

      if (hasAge3) {
        game.youLose(player, self.name)
      }
    },
    (game, player, { self }) => {
      const hasAge7 = game
        .cards.byPlayer(player, 'hand')
        .some(card => card.getAge() === 7)

      if (hasAge7) {
        game.youWin(player, self.name)
      }
    },
    (game, player) => {
      game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'hand'), { count: 2 })
      game.actions.chooseAndScore(player, game.cards.byPlayer(player, 'hand'), { count: 4 })
      game.actions.splay(player, 'blue', 'up')
    }
  ],
}
