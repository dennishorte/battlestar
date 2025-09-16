module.exports = {
  name: `Hunt-Lennox Globe`,
  color: `green`,
  age: 4,
  expansion: `arti`,
  biscuits: `sshs`,
  dogmaBiscuit: `s`,
  dogma: [
    `If you have fewer than four cards in your hand, return all non-green top cards from your board. Draw a {5} for each card returned. Meld a card from your hand.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      if (game.getCardsByZone(player, 'hand').length < 4) {
        game.log.add({ template: 'Player has fewer than 4 cards in hand.' })
        const toReturn = game
          .getTopCards(player)
          .filter(card => card.color !== 'green')
        const returned = game.aReturnMany(player, toReturn)
        if (returned) {
          for (let i = 0; i < returned.length; i++) {
            game.aDraw(player, { age: game.getEffectAge(self, 5) })
          }
        }
      }
      else {
        game.log.add({ template: 'Player has 4 or more cards in hand' })
      }

      game.actions.chooseAndMeld(player, game.getCardsByZone(player, 'hand'))
    }
  ],
}
