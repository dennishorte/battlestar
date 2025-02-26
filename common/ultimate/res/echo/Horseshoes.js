const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Horseshoes`  // Card names are unique in Innovation
  this.name = `Horseshoes`
  this.color = `red`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `h2&k`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = `Draw and foreshadow a {2}.`
  this.karma = []
  this.dogma = [
    `I demand you transfer a top card that has no {k} and no {f} from your board to my board! If you do, draw and meld a {2}.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game
        .getTopCards(player)
        .filter(card => !card.checkHasBiscuit('k') && !card.checkHasBiscuit('f'))
      const card = game.aChooseCard(player, choices)

      if (card) {
        const transferred = game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
        if (transferred) {
          game.aDrawAndMeld(player, game.getEffectAge(this, 2))
        }
      }
    }
  ]
  this.echoImpl = (game, player) => {
    game.aDrawAndForeshadow(player, game.getEffectAge(this, 2))
  }
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
