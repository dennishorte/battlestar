const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Puppet`  // Card names are unique in Innovation
  this.name = `Puppet`
  this.color = `purple`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `hk3k`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Junk an available achievement of value equal to the value of a card in your score pile.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      const ages = game
        .getCardsByZone(player, 'score')
        .map(c => c.getAge())
      game.aChooseAndJunkAchievement(player, ages)
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
