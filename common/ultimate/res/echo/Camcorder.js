const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Camcorder`  // Card names are unique in Innovation
  this.name = `Camcorder`
  this.color = `red`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `hiif`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer all cards in your hand to my hand! Draw a {9}!`,
    `Meld all {9} from your hand. Return all other cards from your hand. Draw three {9}.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      game.aTransferMany(player, game.getCardsByZone(player, 'hand'), game.getZoneByPlayer(leader, 'hand'))
      game.aDraw(player, { age: game.getEffectAge(this, 9) })
    },

    (game, player) => {
      const toMeld = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.getAge() === game.getEffectAge(this, 9))
      game.aMeldMany(player, toMeld)
      game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
      game.aDraw(player, { age: game.getEffectAge(this, 9) })
      game.aDraw(player, { age: game.getEffectAge(this, 9) })
      game.aDraw(player, { age: game.getEffectAge(this, 9) })
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
