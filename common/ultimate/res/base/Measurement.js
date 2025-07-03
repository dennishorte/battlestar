module.exports = {
  name: `Measurement`,
  color: `green`,
  age: 5,
  expansion: `base`,
  biscuits: `slsh`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may reveal and return a card from your hand. If you do, splay that color of your cards right, and draw a card of value equal to the number of cards of that color on your board.`
  ],
  dogmaImpl: [
    (game, player) => {
      const card = game.actions.chooseCard(player, game.getCardsByZone(player, 'hand'), {
        min: 0,
        max: 1,
      })
      if (card) {
        game.mReveal(player, card)
        game.aReturn(player, card)
        game.aSplay(player, card.color, 'right')
        game.aDraw(player, { age: game.getCardsByZone(player, card.color).length })
      }
      else {
        game.log.addDoNothing(player)
      }
    }
  ],
}
