const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Time`  // Card names are unique in Innovation
  this.name = `Time`
  this.color = `yellow`
  this.age = 8
  this.expansion = `arti`
  this.biscuits = `hiis`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer a non-yellow card with a {i} from your board to my board! If you do, repeat this effect!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      while (true) {
        const choices = game
          .getTopCards(player)
          .filter(card => card.color !== 'yellow' && card.checkHasBiscuit('i'))
        const card = game.aChooseCard(player, choices)
        if (card) {
          game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
          continue
        }
        else {
          game.mLog({ template: 'No card was transferred' })
          break
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
