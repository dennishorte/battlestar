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
    `You may choose to exchange all the highest cards in your hand with all the highest cards in your score pile, or junk all cards in the {3} deck.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = ["Exchange highest cards between hand and score pile", "Junk all cards in the 3 deck"]
      const decision = game.aChoose(player, choices, { title: "Choose one" })[0]

      if (decision === choices[0]) {
        game.mLog({
          template: '{player} exchanges the highest cards in their hand and score pile',
          args: { player }
        })
        const hand = game.getZoneByPlayer(player, 'hand')
        const score = game.getZoneByPlayer(player, 'score')
        const handHighest = game.utilHighestCards(hand.cards())
        const scoreHighest = game.utilHighestCards(score.cards())

        game.aExchangeCards(player, handHighest, scoreHighest, hand, score)
      }
      else {
        game.aJunkDeck(player, 3)
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

module.exports = Card
