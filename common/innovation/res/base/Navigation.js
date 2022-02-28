const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Navigation`  // Card names are unique in Innovation
  this.name = `Navigation`
  this.color = `green`
  this.age = 4
  this.expansion = `base`
  this.biscuits = `hccc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a {2} or {3} from your score pile, if it has any, to my score pile.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game
        .getCardsByZone(player, 'score')
        .filter(card => card.age === 2 || card.age === 3)
      game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(leader, 'score'))
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
