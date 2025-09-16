module.exports = {
  name: `Baghdad Battery`,
  color: `green`,
  age: 2,
  expansion: `arti`,
  biscuits: `cshc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Meld two cards from your hand. If you melded two of the same color and they are of different type, draw and score five {2}s.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const cards = game.actions.chooseAndMeld(player, game.getCardsByZone(player, 'hand'), { count: 2 })

      if (
        cards
        && cards.length === 2
        && cards[0].color === cards[1].color
        && cards[0].expansion !== cards[1].expansion
      ) {
        for (let i = 0; i < 5; i++) {
          game.actions.drawAndScore(player, game.getEffectAge(self, 2))
        }
      }
    },
  ],
}
