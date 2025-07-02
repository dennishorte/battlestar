const util = require('../../../lib/util.js')

module.exports = {
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
        ...game.getCardsByZone(player, 'hand'),
        ...game.getCardsByZone(player, 'score'),
      ]
      const cardCounts = util.array.countBy(handAndScore, (card) => card.getAge())

      const eligibleAges = Object.entries(cardCounts)
        .filter(([, count]) => count === 2 || count === 3)
        .map(([age]) => parseInt(age))

      if (eligibleAges.length === 0) {
        game.log.addNoEffect()
        return
      }

      const age = game.aChooseAge(player, eligibleAges, { title: 'Choose age of cards to transfer' })

      const transferCards = handAndScore.filter(card => card.getAge() === age)
      const rightPlayer = game.players.rightOf(player)
      game.aTransferMany(player, transferCards, game.getZoneByPlayer(rightPlayer, 'score'))
    },
    (game, player) => {
      const choices = game.getCardsByZone(player, 'hand')

      if (choices.length < 2) {
        game.log.add({ template: 'not enough cards in hand' })
        return
      }

      game.aChooseAndScore(player, choices, { min: 2, max: 3 })
    }
  ],
}
