const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Plush Beweglich Rod Bear`  // Card names are unique in Innovation
  this.name = `Plush Beweglich Rod Bear`
  this.color = `yellow`
  this.age = 8
  this.expansion = `arti`
  this.biscuits = `lllh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a value. Splay up each color with a top card of the chosen value. Return all cards of the chosen value from all score piles.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const age = game.aChooseAge(player)

      game
        .utilColors()
        .map(color => game.getZoneByPlayer(player, color))
        .filter(zone => zone.cards().length >= 2 && zone.cards()[0].getAge() === age)
        .forEach(zone => game.aSplay(player, zone.color, 'up'))

      const toReturn = game
        .getPlayerAll()
        .flatMap(player => game.getCardsByZone(player, 'score'))
        .filter(card => card.getAge() === age)

      game.aReturnMany(player, toReturn)
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
