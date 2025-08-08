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
    (game, player) => {
      const toReturn = game
        .getZoneById('achievements')
        .cards()
        .filter(card => !card.isSpecialAchievement)
      game.aReturnMany(player, toReturn, { ordered: true })

      const score = game.getCardsByZone(player, 'score')
      const returnCount = Math.ceil(score.length / 2)
      game.aChooseAndReturn(player, score, { count: returnCount })

      game.aDrawAndMeld(player, game.getEffectAge(this, 10))
      game.aDrawAndMeld(player, game.getEffectAge(this, 10))
    }
  ],
  echoImpl: [],
}
