module.exports = {
  name: `Ninja`,
  color: `red`,
  age: 4,
  expansion: `usee`,
  biscuits: `clhl`,
  dogmaBiscuit: `l`,
  dogma: [
    `I demand you return a card of the color of my choice from your hand! If you do, transfer the top card of that color from your board to mine!`,
    `You may splay your red cards right.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const chosenColor = game.actions.chooseColor(leader)
      const choices = game.cards.byPlayer(player, 'hand').filter(c => c.color === chosenColor)
      const returnedCard = game.actions.chooseAndReturn(player, choices, { reveal: true })[0]

      if (returnedCard) {
        const topCard = game.getTopCard(player, chosenColor)
        if (topCard) {
          game.actions.transfer(player, topCard, game.zones.byPlayer(leader, topCard.color))
        }
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['red'], 'right')
    },
  ],
}
