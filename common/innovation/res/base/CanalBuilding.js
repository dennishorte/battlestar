const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Canal Building`  // Card names are unique in Innovation
  this.name = `Canal Building`
  this.color = `yellow`
  this.age = 2
  this.expansion = `base`
  this.biscuits = `hclc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may exchange all the highest cards in your hand with all the highest cards in your score pile.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const decision = game.aYesNo(player, 'Exchange the highest card in your hand and score pile?')
      if (decision) {
        game.mLog({
          template: '{player} swaps the highest cards in their hand and score pile',
          args: { player }
        })
        const hand = game.getZoneByPlayer(player, 'hand')
        const score = game.getZoneByPlayer(player, 'score')
        const handHighest = highest(hand.cards())
        const scoreHighest = highest(score.cards())

        handHighest.forEach(card => game.mMoveCardTo(card, score))
        scoreHighest.forEach(card => game.mMoveCardTo(card, hand))
      }
      else {
        game.mLogDoNothing(player)
      }
    }
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

function highest(cards) {
  if (cards.length === 0) {
    return cards
  }
  const sorted = cards.sort((l, r) => r.age - l.age)
  const highest = sorted[0].age
  return sorted.filter(card => card.age === highest)
}

module.exports = Card
