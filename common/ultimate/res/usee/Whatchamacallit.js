module.exports = {
  name: `Whatchamacallit`,
  color: `yellow`,
  age: 10,
  expansion: `usee`,
  biscuits: `hlfl`,
  dogmaBiscuit: `l`,
  dogma: [
    `For each value, in ascending order, if that value is not a value of a top card on your board or a card in your score pile, draw and score a card of that value.`
  ],
  dogmaImpl: [
    (game, player) => {
      const topCardValues = game
        .getTopCards(player)
        .map(c => c.age)

      const scoreCardValues = game
        .cards.byPlayer(player, 'score')
        .map(c => c.age)

      for (const age of game.utilAges()) {
        if (!topCardValues.includes(age) && !scoreCardValues.includes(age)) {
          game.aDrawAndScore(player, age)
        }
      }
    },
  ],
}
