const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Bifocals`  // Card names are unique in Innovation
  this.name = `Bifocals`
  this.color = `blue`
  this.age = 6
  this.expansion = `echo`
  this.biscuits = `&hcc`
  this.dogmaBiscuit = `c`
  this.echo = `Draw and foreshadow a card of any value.`
  this.karma = []
  this.dogma = [
    `You may return a card from your forecast. If you do, draw and foreshadow a card of equal value to the card returned.`,
    `You may splay your green cards right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const returned = game.aChooseAndReturn(player, game.getCardsByZone(player, 'forecast'), { min: 0, max: 1 })

      if (returned && returned.length > 0) {
        game.aDrawAndForeshadow(player, returned[0].getAge())
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['green'], 'right')
    }
  ]
  this.echoImpl = (game, player) => {
    const age = game.aChooseAge(player)
    game.aDrawAndForeshadow(player, age)
  }
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
