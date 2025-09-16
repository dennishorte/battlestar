module.exports = {
  name: `Xianrendong Shards`,
  color: `yellow`,
  age: 1,
  expansion: `arti`,
  biscuits: `hlll`,
  dogmaBiscuit: `l`,
  dogma: [
    `Reveal three cards from your hand. Score two, then tuck the other. If the scored cards were the same color, draw three {1}s.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const cards = game.actions.chooseAndReveal(
        player,
        game.getCardsByZone(player, 'hand'),
        { count: 3 }
      )

      if (cards.length > 0) {
        const toScore = game.actions.chooseCards(player, cards, { count: 2, title: 'Card to score' })
        const scored = game.actions.scoreMany(player, toScore)

        const remaining = cards.filter(card => !toScore.includes(card))
        if (remaining.length > 0) {
          game.actions.tuck(player, remaining[0])
        }

        if (scored.length == 2 && scored[0].color === scored[1].color) {
          game.actions.draw(player, { age: game.getEffectAge(self, 1) })
          game.actions.draw(player, { age: game.getEffectAge(self, 1) })
          game.actions.draw(player, { age: game.getEffectAge(self, 1) })
        }
      }
    }
  ],
}
