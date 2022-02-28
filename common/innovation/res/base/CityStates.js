const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `City States`  // Card names are unique in Innovation
  this.name = `City States`
  this.color = `purple`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `hcck`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a top card with a {k} from your board to my board if you have at least four {k} on your board! If you do, draw a {1}.`
  ]

  this.dogmaImpl = [
    (game, player, { biscuits, leader }) => {
      if (biscuits[player.name].k >= 4) {
        const choices = game
          .getTopCards(player)
          .filter(card => card.biscuits.includes('k'))

        const card = game.aChooseCard(player, choices)
        if (card) {
          const transferred = game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
          if (transferred) {
            game.aDraw(player, { age: game.getEffectAge(this, 1) })
          }
          else {
            game.mLog({ template: 'no card was transferred' })
          }
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
