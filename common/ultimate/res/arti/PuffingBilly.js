module.exports = {
  name: `Puffing Billy`,
  color: `blue`,
  age: 6,
  expansion: `arti`,
  biscuits: `fhff`,
  dogmaBiscuit: `f`,
  dogma: [
    `Return a card from your hand. Draw a card of value equal to the highest number of symbols of the same type visible in that color on your board. Splay right that color.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'))
      if (cards && cards.length > 0) {
        const returned = cards[0]
        const biscuits = game.getBiscuitsByZone(game.zones.byPlayer(player, returned.color))
        const sorted = Object
          .entries(biscuits)
          .sort((l, r) => r[1] - l[1])
        const count = sorted[0][1]
        game.actions.draw(player, { age: count })
        game.actions.splay(player, returned.color, 'right')
      }
    }
  ],
}
