module.exports = {
  name: `Calendar`,
  color: `blue`,
  age: 2,
  expansion: `base`,
  biscuits: `hlls`,
  dogmaBiscuit: `l`,
  dogma: [
    `If you have more cards in your score pile than in your hand, draw two {3}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const scoreCount = game
        .zones.byPlayer(player, 'score')
        .cards()
        .length
      const handCount = game
        .zones.byPlayer(player, 'hand')
        .cards()
        .length

      if (scoreCount > handCount) {
        game.actions.draw(player, { age: game.getEffectAge(self, 3) })
        game.actions.draw(player, { age: game.getEffectAge(self, 3) })
      }
      else {
        game.log.addNoEffect()
      }
    }
  ],
}
