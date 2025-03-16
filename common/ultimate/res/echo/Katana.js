const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Katana`  // Card names are unique in Innovation
  this.name = `Katana`
  this.color = `red`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `kkhk`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer two top cards with a {k} from your board to my score pile! If you transferred any, draw a card of value equal to the total number of {k} on those cards and transfer it to my forecast!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('k'))
      const transferred = game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(leader, 'score'), { count: 2 })

      if (transferred && transferred.length > 0) {
        const castleCount = transferred
          .flatMap(card => card.biscuits.split(''))
          .filter(biscuit => biscuit === 'k')
          .length

        const card = game.aDraw(player, { age: castleCount })
        if (card) {
          game.aTransfer(player, card, game.getZoneByPlayer(leader, 'forecast'))
        }
      }
    }
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
