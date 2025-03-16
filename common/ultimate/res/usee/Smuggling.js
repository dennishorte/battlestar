const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Smuggling`  // Card names are unique in Innovation
  this.name = `Smuggling`
  this.color = `green`
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a card of value equal to your top yellow card and a card of value equal to my top yellow card from your score pile to my score pile!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      for (const target of [player, leader]) {
        const topYellow = game.getTopCard(target, 'yellow')
        if (topYellow) {
          const choices = game
            .getCardsByZone(player, 'score')
            .filter(c => c.getAge() === topYellow.getAge())
          game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(leader, 'score'), {
            title: 'Transfer a card for ' + target.name,
            count: 1,
          })
        }
      }
    },
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
