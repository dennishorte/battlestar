module.exports = {
  name: `Bifocals`,
  color: `blue`,
  age: 6,
  expansion: `echo`,
  biscuits: `&hcc`,
  dogmaBiscuit: `c`,
  echo: `Draw and foreshadow a card of any value.`,
  dogma: [
    `You may return a card from your forecast. If you do, draw and foreshadow a card of equal value to the card returned.`,
    `You may splay your green cards right.`
  ],
  dogmaImpl: [
    (game, player) => {
      const returned = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'forecast'), { min: 0, max: 1 })

      if (returned && returned.length > 0) {
        game.actions.drawAndForeshadow(player, returned[0].getAge())
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['green'], 'right')
    }
  ],
  echoImpl: (game, player) => {
    const age = game.actions.chooseAge(player)
    game.actions.drawAndForeshadow(player, age)
  },
}
