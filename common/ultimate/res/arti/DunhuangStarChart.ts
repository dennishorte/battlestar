export default {
  name: `Dunhuang Star Chart`,
  color: `blue`,
  age: 3,
  expansion: `arti`,
  biscuits: `sshs`,
  dogmaBiscuit: `s`,
  dogma: [
    `Return all cards in your hand. Draw a card of value equal to the number of cards you return.`
  ],
  dogmaImpl: [
    (game, player) => {
      const returned = game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))

      if (returned) {
        game.actions.draw(player, { age: returned.length })
      }
    }
  ],
}
