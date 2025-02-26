const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Encyclopedia`  // Card names are unique in Innovation
  this.name = `Encyclopedia`
  this.color = `blue`
  this.age = 6
  this.expansion = `base`
  this.biscuits = `hccc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may meld all the highest cards in your score pile. If you meld one of the highest, you must meld all of the highest.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const highest = game.utilHighestCards(game.getCardsByZone(player, 'score'))
      const doIt = game.aYesNo(player, 'Meld all the highest cards in your score pile?')

      if (doIt) {
        game.aMeldMany(player, highest)
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
