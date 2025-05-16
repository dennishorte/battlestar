const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Steamboat`  // Card names are unique in Innovation
  this.name = `Steamboat`
  this.color = `green`
  this.age = 6
  this.expansion = `echo`
  this.biscuits = `h6cc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw and reveal a {6}! If it is blue or yellow, transfer it and all cards in your hand to my hand! If it is red or green, keep it and transfer two cards from your score pile to mine! If it is purple, keep it!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 6))
      if (card) {
        if (card.color === 'blue' || card.color === 'yellow') {
          game.aTransferMany(player, game.getCardsByZone(player, 'hand'), game.getZoneByPlayer(leader, 'hand'))
        }

        else if (card.color === 'red' || card.color === 'green') {
          game.aChooseAndTransfer(player, game.getCardsByZone(player, 'score'), game.getZoneByPlayer(leader, 'score'), { count: 2 })
        }

        else {
          game.log.add({
            template: 'Card was purple. No effect.'
          })
        }
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
