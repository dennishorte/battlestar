module.exports = {
  name: `Noodles`,
  color: `yellow`,
  age: 1,
  expansion: `echo`,
  biscuits: `khk1`,
  dogmaBiscuit: `k`,
  echo: [],
  dogma: [
    `If you have more {1} in your hand than every opponent, draw and score a {2}.`,
    `Draw and reveal a {1}. If it is yellow, score all {1} from your hand.`
  ],
  dogmaImpl: [
    (game, player) => {
      const mine = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.getAge() === game.getEffectAge(this, 1))
        .length
      const theirs = game
        .players.opponentsOf(player)
        .map(player => game
          .cards.byPlayer(player, 'hand')
          .filter(card => card.getAge() === game.getEffectAge(this, 1))
          .length
        )

      if (theirs.every(count => count < mine)) {
        game.actions.drawAndScore(player, game.getEffectAge(this, 2))
      }
      else {
        game.log.addNoEffect()
      }
    },

    (game, player) => {
      const card = game.actions.drawAndReveal(player, game.getEffectAge(this, 1))
      if (card && card.color === 'yellow') {
        const toScore = game
          .cards.byPlayer(player, 'hand')
          .filter(card => card.getAge() === game.getEffectAge(this, 1))
        game.actions.scoreMany(player, toScore, { ordered: true })
      }
    },
  ],
  echoImpl: [],
}
