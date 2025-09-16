module.exports = {
  name: `Colt Paterson Revolver`,
  color: `yellow`,
  age: 7,
  expansion: `arti`,
  biscuits: `fhfc`,
  dogmaBiscuit: `f`,
  dogma: [
    // `I compel you to reveal your hand! Draw a {7}! If the color of the drawn card matches the color of any other card in your hand, return all cards in your hand and all cards in your score pile!`
    `I compel you to draw and reveal a {7}! If the color of the drawn card matches the color of any other card in your hand, return all cards in your hand and all cards in your score pile!`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const preDrawHand = game.getCardsByZone(player, 'hand')
      const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 7))

      if (preDrawHand.some(other => other.color === card.color)) {
        game.actions.returnMany(player, game.getCardsByZone(player, 'hand'))
        game.actions.returnMany(player, game.getCardsByZone(player, 'score'))
      }
    }
  ],
}
