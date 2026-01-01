module.exports = {
  name: `Foraging`,
  color: `green`,
  age: 0,
  expansion: `base`,
  biscuits: `lhlr`,
  dogmaBiscuit: `l`,
  dogma: [
    `Draw a {z}. If it has no {r}, you may reveal it, score it, and draw a {z}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const drawnCard = game.actions.draw(player, { age: game.getEffectAge(self, 0) })

      if (drawnCard && !drawnCard.checkHasBiscuit('r')) {
        const revealAndScore = game.actions.chooseYesNo(player, 'Reveal and score the drawn card?')
        if (revealAndScore) {
          game.actions.reveal(player, drawnCard)
          game.actions.score(player, drawnCard)
          game.actions.draw(player, { age: game.getEffectAge(self, 0) })
        }
      }
    }
  ],
}
