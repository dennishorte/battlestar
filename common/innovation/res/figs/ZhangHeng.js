const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Zhang Heng`  // Card names are unique in Innovation
  this.name = `Zhang Heng`
  this.color = `blue`
  this.age = 2
  this.expansion = `figs`
  this.biscuits = `l&2h`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Draw and tuck a {3}. Score all cards above it.`
  this.karma = [
    `Each card in your score pile counts as a bonus of its value on your board.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    const card = game.aDrawAndTuck(player, game.getEffectAge(this, 3))
    if (card) {
      const zone = game.getZoneByPlayer(player, card.color)
      while (zone.cards()[0] !== undefined && zone.cards()[0] !== card) {
        game.aScore(player, zone.cards()[0])
      }
    }
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'list-bonuses',
      func: (game, player) => {
        return game
          .getCardsByZone(player, 'score')
          .map(card => card.age)
      }
    }
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
