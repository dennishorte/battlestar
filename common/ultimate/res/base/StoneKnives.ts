export default {
  name: `Stone Knives`,
  color: `red`,
  age: 0,
  expansion: `base`,
  biscuits: `hkck`,
  dogmaBiscuit: `k`,
  dogma: [
    `I demand you draw, reveal, and return a {z}! Transfer your top card of the color of the revealed card to my board!`,
    `If Skinning is a top card on your board, draw a {1}.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 0))
      game.actions.return(player, card)

      const topCard = game.cards.top(player, card.color)
      if (topCard) {
        game.actions.transfer(player, topCard, game.zones.byPlayer(leader, card.color))
      }
    },
    (game, player, { self }) => {
      const topCards = game.cards.tops(player)
      const skinning = topCards.find(card => card.name === 'Skinning')
      if (skinning) {
        game.actions.draw(player, { age: game.getEffectAge(self, 1) })
      }
    },
  ],
}
