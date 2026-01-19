export default {
  name: `16 Psyche`,
  color: `red`,
  age: 11,
  expansion: `arti`,
  biscuits: `fffh`,
  dogmaBiscuit: `f`,
  dogma: [
    `Choose a value different from any top card on your board. Score all cards in the deck of that value. Score all cards in the junk of that value.`
  ],
  dogmaImpl: [
    (game, player) => {
      const topCards = game.cards.tops(player)
      const values = game.getAges().filter(age => topCards.every(card => card.getAge() !== age))

      const age = game.actions.chooseAge(player, values)
      const deckCards = game.cards.byDeck('base', age)
      game.actions.scoreMany(player, deckCards, { ordered: true })

      const junkCards = game.cards.byZone('junk').filter(card => card.getAge() === age)
      game.actions.scoreMany(player, junkCards, { ordered: true })
    },
  ],
}
