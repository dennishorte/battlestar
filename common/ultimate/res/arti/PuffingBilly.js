module.exports = {
  name: `Puffing Billy`,
  color: `blue`,
  age: 6,
  expansion: `arti`,
  biscuits: `fhff`,
  dogmaBiscuit: `f`,
  dogma: [
    `Tuck a card from your hand. Splay right its color on your board. Draw a card of value equal to the highest number of symbols of the same type visible in that color on your board.`
  ],
  dogmaImpl: [
    (game, player) => {
      const returned = game.actions.chooseAndTuck(player, game.cards.byPlayer(player, 'hand'))[0]
      if (returned) {
        game.actions.splay(player, returned.color, 'right')

        const biscuits = player.biscuitsByColor()[returned.color]
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
