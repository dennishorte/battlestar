module.exports = {
  name: `Dunhuang Star Chart`,
  color: `blue`,
  age: 3,
  expansion: `arti`,
  biscuits: `sshs`,
  dogmaBiscuit: `s`,
  dogma: [
    `Return all cards from your hand. Draw a card of value equal to the number of cards returned.`
  ],
  dogmaImpl: [
    (game, player) => {
      const returned = game.aReturnMany(player, game.getCardsByZone(player, 'hand'))

      if (returned) {
        game.aDraw(player, { age: returned.length })
      }
    }
  ],
}
