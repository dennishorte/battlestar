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
        .getTopCards(player)
        .map(card => card.color)

      const choices = game
        .getZoneByPlayer(player, 'hand')
        .cards()
        .filter(card => boardColors.includes(card.color))

      const tucked = game.aChooseAndTuck(player, choices, { min: 0, max: 1 })

      if (tucked && tucked.length > 0) {
        const color = tucked[0].color
        game.aChooseAndSplay(player, [color], 'left')
      }
    }
  ],
}
