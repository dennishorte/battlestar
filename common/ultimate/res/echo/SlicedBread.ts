export default {
  name: `Sliced Bread`,
  color: `green`,
  age: 8,
  expansion: `echo`,
  biscuits: `&h9c`,
  dogmaBiscuit: `c`,
  echo: `Return all cards from your hand and draw two {8}.`,
  dogma: [
    `Return a card from your score pile. Draw and score two cards of value one less than the value of the card returned.`
  ],
  dogmaImpl: [
    (game, player) => {
      const returned = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'score'))[0]
      if (returned) {
        game.actions.drawAndScore(player, returned.getAge() - 1)
        game.actions.drawAndScore(player, returned.getAge() - 1)
      }
    }
  ],
  echoImpl: (game, player, { self }) => {
    game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))
    game.actions.draw(player, { age: game.getEffectAge(self, 8) })
    game.actions.draw(player, { age: game.getEffectAge(self, 8) })
  },
}
