module.exports = {
  name: `Meji-Mura Stamp Vending Machine`,
  color: `green`,
  age: 8,
  expansion: `arti`,
  biscuits: `lchc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Return a card from your hand. Draw and score three cards of the returned card's value.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'))
      if (cards && cards.length > 0) {
        const age = cards[0].getAge()
        game.aDrawAndScore(player, age)
        game.aDrawAndScore(player, age)
        game.aDrawAndScore(player, age)
      }
    }
  ],
}
