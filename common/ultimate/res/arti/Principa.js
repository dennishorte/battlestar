module.exports = {
  name: `Principa`,
  color: `blue`,
  age: 5,
  expansion: `arti`,
  biscuits: `sshs`,
  dogmaBiscuit: `s`,
  dogma: [
    `Return all non-blue top cards from your board. For each card returned, draw and meld a card of value one higher than the value of the returned card, in ascending order.`
  ],
  dogmaImpl: [
    (game, player) => {
      const toReturn = game
        .getTopCards(player)
        .filter(card => card.color !== 'blue')

      const returned = game
        .actions.returnMany(player, toReturn)
        .sort((l, r) => l.getAge() - r.getAge())

      for (const card of returned) {
        game.actions.drawAndMeld(player, card.getAge() + 1)
      }
    }
  ],
}
