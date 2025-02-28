const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Clown Car`  // Card names are unique in Innovation
  this.name = `Clown Car`
  this.color = `purple`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `cchl`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you meld a card from my score pile! If the melded card has no {l}, repeat this effect!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      let canRepeat = true
      while (canRepeat) {
        const scoreCards = game.getCardsByZone(leader, 'score')
        const card = game.aChooseAndTransfer(leader, scoreCards, game.getZoneByPlayer(player, card => card.color))
        if (card) {
          game.mMeldCard(player, card)
          canRepeat = !card.checkHasBiscuit('l')
        }
        else {
          canRepeat = false
        }
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