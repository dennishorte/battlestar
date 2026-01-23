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
      const card = game.actions.chooseCard(player, game.cards.byPlayer(player, 'hand'), {
        min: 0,
        max: 1,
      })
      if (card) {
        game.actions.reveal(player, card)
        game.actions.return(player, card)
        game.actions.splay(player, card.color, 'right')
        game.actions.draw(player, { age: game.cards.byPlayer(player, card.color).length })
      }
      else {
        game.log.addDoNothing(player, 'return a card')
      }
    }
  ],
}
