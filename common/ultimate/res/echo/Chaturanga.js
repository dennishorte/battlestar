const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Chaturanga`  // Card names are unique in Innovation
  this.name = `Chaturanga`
  this.color = `purple`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `c3ch`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld a card from your hand. Draw and foreshadow a card of value equal to the melded card.`,
    `If Chaturanga was foreseen, draw and foreshadow a card of value equal to the number of colors on your board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aChooseAndMeld(player, game.getCardsByZone(player, 'hand'))[0]
      const age = card ? card.getAge() : 0
      game.aDrawAndForeshadow(player, age)
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        game.mLogWasForeseen(self)
        const count = game.getTopCards(player).length
        game.aDrawAndForeshadow(player, count)
      }
      else {
        game.mLogNoEffect()
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
