module.exports = {
  name: `Pride and Prejudice`,
  color: `yellow`,
  age: 6,
  expansion: `arti`,
  biscuits: `hsls`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and meld a {6}. If the drawn card's color is the color with the fewest (or tied) number of cards on your board, score the melded card, and repeat this effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 6))

        if (card) {
          const numCards = game
            .cards.byPlayer(player, card.color)
            .length

          const hasFewestCards = game
            .util.colors()
            .map(color => game.cards.byPlayer(player, color).length)
            .every(count => count >= numCards)

          if (hasFewestCards) {
            game.actions.score(player, card)
            continue
          }
          else {
            break
          }
        }
        else {
          break
        }
      }
    }
  ],
}
