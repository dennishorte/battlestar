export default {
  name: `Pizza Pacaya`,
  color: `red`,
  age: 11,
  expansion: `arti`,
  biscuits: `hcic`,
  dogmaBiscuit: `c`,
  dogma: [
    `I compel you to junk all cards from your board. Draw and meld a card of each value in ascending order.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const toJunk = game.zones.colorStacks(player).flatMap(zone => zone.cardlist())
      game.actions.junkMany(player, toJunk)

      for (const age of game.getAges()) {
        game.actions.drawAndMeld(player, age)
      }
    },
  ],
}
