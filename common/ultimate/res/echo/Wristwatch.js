module.exports = {
  name: `Wristwatch`,
  color: `yellow`,
  age: 9,
  expansion: `echo`,
  biscuits: `hfa&`,
  dogmaBiscuit: `f`,
  echo: `Tuck a top card from your board.`,
  dogma: [
    `If Wristwatch was foreseen, return all non-bottom cards from your board.`,
    `For each value in ascending order, if you have a bonus of that value, draw and meld a card of that value.`
  ],
  dogmaImpl: [
    (game, player, { foreseen, self }) => {
      game.log.addForeseen(foreseen, self)
      if (foreseen) {
        const toReturn = game
          .util
          .colors()
          .map(color => game.cards.byPlayer(player, color))
          .flatMap(stack => stack.slice(0, -1))

        game.actions.returnMany(player, toReturn)
      }
    },

    (game, player) => {
      const bonuses = game.getBonuses(player)
      const ages = game.getAges().filter(age => bonuses.includes(age))
      for (const age of ages) {
        game.actions.drawAndMeld(player, age)
      }
    }
  ],
  echoImpl: (game, player) => {
    const choices = game.cards.tops(player)
    game.actions.chooseAndTuck(player, choices)
  },
}
