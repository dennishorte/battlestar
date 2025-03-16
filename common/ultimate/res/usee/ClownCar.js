const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Clown Car`  // Card names are unique in Innovation
  this.name = `Clown Car`
  this.color = `purple`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `cchl`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you meld a card from my score pile! If the melded card has no {c}, repeat this effect!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      let canRepeat = true
      while (canRepeat) {
        const scoreCards = game.getCardsByZone(leader, 'score')
        const card = game.aChooseCards(leader, scoreCards, { hidden: true })[0]
        if (card) {
          game.aMeld(player, card)
          canRepeat = !card.checkHasBiscuit('c')
        }
        else {
          canRepeat = false
        }
      }
    },
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
