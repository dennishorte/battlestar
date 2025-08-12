module.exports = {
  name: `Laser`,
  color: `blue`,
  age: 9,
  expansion: `echo`,
  biscuits: `sshl`,
  dogmaBiscuit: `s`,
  echo: ``,
  dogma: [
    `Return all unclaimed standard achievements. Then, return half (rounded up) of the cards in your score pile. Draw and meld two {0}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const toReturn = game
        .zones.byId('achievements')
        .cardlist()
        .filter(card => !card.isSpecialAchievement)
      game.actions.returnMany(player, toReturn, { ordered: true })

      const score = game.cards.byPlayer(player, 'score')
      const returnCount = Math.ceil(score.length / 2)
      game.actions.chooseAndReturn(player, score, { count: returnCount })

      game.actions.drawAndMeld(player, game.getEffectAge(self, 10))
      game.actions.drawAndMeld(player, game.getEffectAge(self, 10))
    }
  ],
  echoImpl: [],
}
