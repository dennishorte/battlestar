const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Spanish Inquisition`  // Card names are unique in Innovation
  this.name = `Spanish Inquisition`
  this.color = `red`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `shss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return all but the highest cards from your hand and all but the highest cards from your score pile!`,
    `If Spanish Inquisition is a top card on your board, return all red cards from your board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const hand = game.getZoneByPlayer(player, 'hand')
      const handHighest = game.utilHighestCards(hand.cards())
      const handReturn = hand.cards().filter(c => !handHighest.includes(c))
      game.aReturnMany(player, handReturn)

      const score = game.getZoneByPlayer(player, 'score')
      const scoreHighest = game.utilHighestCards(score.cards())
      const scoreReturn = score.cards().filter(c => !scoreHighest.includes(c))
      game.aReturnMany(player, scoreReturn)
    },
    (game, player) => {
      if (game.getTopCard(player, 'red').name === 'Spanish Inquisition') {
        const redCards = game.getCardsByZone(player, 'red')
        game.aReturnMany(player, redCards, { ordered: true })
      }
      else {
        game.mLogNoEffect()
      }
    },
  ]
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
