const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Astrobiology`  // Card names are unique in Innovation
  this.name = `Astrobiology`
  this.color = `blue`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `llph`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a bottom card from your board. Splay that color on your board aslant. Score all cards on your board of that color without {l}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const bottomCards = game.getBottomCards(player)
      const card = game.aChooseAndReturn(player, bottomCards)[0]

      if (card) {
        game.aSplay(player, card.color, 'aslant')

        const cardsToScore = game
          .getCardsByZone(player, card.color)
          .filter(c => !c.checkHasBiscuit('l'))

        game.aScoreMany(player, cardsToScore)
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
