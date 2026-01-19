export default {
  name: `Holography`,
  color: `purple`,
  age: 11,
  expansion: `usee`,
  biscuits: `pphp`,
  dogmaBiscuit: `p`,
  dogma: [
    `Choose red, blue, or green. Score all but your top two cards of that color, then splay it aslant. If you do both, exchange all the lowest cards in your score pile with all your claimed standard achievements of lower value.`
  ],
  dogmaImpl: [
    (game, player) => {
      const color = game.actions.choose(player, ['red', 'blue', 'green'], {
        title: 'Choose a color to score and splay'
      })[0]

      const cards = game.cards.byPlayer(player, color)
      const toScore = cards.slice(2)
      const scored = game.actions.scoreMany(player, toScore)

      const splayed = game.actions.splay(player, color, 'aslant')

      if (scored.length > 0 && scored.length === toScore.length && splayed) {
        const lowestScoreCards = game.util.lowestCards(game.cards.byPlayer(player, 'score'))

        if (!lowestScoreCards) {
          game.log.addDoNothing()
          return
        }

        const lowestScoreCardsValue = lowestScoreCards[0].getAge()

        const matchingAchievements = game
          .cards.byPlayer(player, 'achievements')
          .filter(card => card.checkIsStandardAchievement())
          .filter(card => card.getAge() < lowestScoreCardsValue)

        game.aExchangeCards(
          player,
          lowestScoreCards,
          matchingAchievements,
          game.zones.byPlayer(player, 'score'),
          game.zones.byPlayer(player, 'achievements'),
        )
      }
    },
  ],
}
