import util from '../../../lib/util.js'

export default {
  name: `Red Envelope`,
  color: `red`,
  age: 3,
  expansion: `usee`,
  biscuits: `lchc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Choose a value at which you have exactly two or three cards altogether in your hand and score pile. Transfer those cards to the score pile of the player on your right.`,
    `You may score exactly two or three cards from your hand.`
  ],
  dogmaImpl: [
    (game, player) => {
      const handAndScore = [
        ...game.cards.byPlayer(player, 'hand'),
        ...game.cards.byPlayer(player, 'score'),
      ]
      const cardCounts = util.array.countBy(handAndScore, (card) => card.getAge())

      const eligibleAges = Object.entries(cardCounts)
        .filter(([, count]) => count === 2 || count === 3)
        .map(([age]) => parseInt(age))

      if (eligibleAges.length === 0) {
        game.log.addNoEffect()
        return
      }

      const age = game.actions.chooseAge(player, eligibleAges, { title: 'Choose age of cards to transfer' })

      const transferCards = handAndScore.filter(card => card.getAge() === age)
      const rightPlayer = game.players.rightOf(player)
      game.actions.transferMany(player, transferCards, game.zones.byPlayer(rightPlayer, 'score'))
    },
    (game, player) => {
      const choices = game.cards.byPlayer(player, 'hand')

      if (choices.length < 2) {
        game.log.add({ template: 'not enough cards in hand' })
        return
      }

      const doScoreCards = game.actions.chooseYesNo(player, 'Score exactly two or three cards from your hand?')

      if (doScoreCards) {
        game.actions.chooseAndScore(player, choices, { min: 2, max: 3 })
      }
    }
  ],
}
