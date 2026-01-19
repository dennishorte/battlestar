export default {
  name: `Colt Paterson Revolver`,
  color: `yellow`,
  age: 7,
  expansion: `arti`,
  biscuits: `fhfc`,
  dogmaBiscuit: `f`,
  dogma: [
    `I compel you to reveal your hand! Draw and reveal a {7}! If the color of the drawn card matches the color of any other card in your hand, return all cards in your hand and all cards in your score pile!`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const preDrawHand = game.cards.byPlayer(player, 'hand')
      game.actions.revealMany(player, preDrawHand, { ordered: true })

      const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 7))

      if (preDrawHand.some(other => other.color === card.color)) {
        game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))
        game.actions.returnMany(player, game.cards.byPlayer(player, 'score'))
      }
    }
  ],
}
