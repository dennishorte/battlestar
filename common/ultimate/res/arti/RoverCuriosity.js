const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Rover Curiosity`  // Card names are unique in Innovation
  this.name = `Rover Curiosity`
  this.color = `blue`
  this.age = 10
  this.expansion = `arti`
  this.biscuits = `hsss`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld an Artifact {0}. Execute each of the effects of the melded card as if they were on this card. Do not share them.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndMeld(player, game.getEffectAge(this, 10), { exp: 'arti' })
      if (card) {
        game.aExecuteAsIf(player, card)
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
