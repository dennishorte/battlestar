module.exports = {
  name: `Rock Around the Clock`,
  color: `yellow`,
  age: 9,
  expansion: `arti`,
  biscuits: `lihi`,
  dogmaBiscuit: `i`,
  dogma: [
    `For each top card on your board with a {i}, draw and score a {9}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const matchingCards = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('i'))
        .length

      for (let i = 0; i < matchingCards; i++) {
        game.aDrawAndScore(player, game.getEffectAge(self, 9))
      }
    }
  ],
}
