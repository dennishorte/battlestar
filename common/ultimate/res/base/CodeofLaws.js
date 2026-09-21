module.exports = {
  name: `Code of Laws`,
  color: `purple`,
  age: 1,
  expansion: `base`,
  biscuits: `hccl`,
  dogmaBiscuit: `c`,
  dogma: [
    `You may tuck a card from your hand of the same color as any card on your board. If you do, you may splay that color of your cards left.`
  ],
  dogmaImpl: [
    (game, player) => {
      const boardColors = game
        .cards.tops(player)
        .map(card => card.color)

      const tucked = game.actions.chooseAndTuck(
        player,
        game.zones.byPlayer(player, 'hand').cardlist(),
        { min: 0, max: 1, filter: card => boardColors.includes(card.color) },
      )

      if (tucked && tucked.length > 0) {
        const color = tucked[0].color
        game.actions.chooseAndSplay(player, [color], 'left')
      }
    }
  ],
}
