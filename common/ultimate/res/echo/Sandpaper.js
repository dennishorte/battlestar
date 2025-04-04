const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sandpaper`  // Card names are unique in Innovation
  this.name = `Sandpaper`
  this.color = `yellow`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `cchl`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return any number of cards from your hand. Draw a {3} for each card you return.`,
    `Meld a card from your hand.`,
    `If Sandpaper was foreseen, foreshadow all cards in your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const returned = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'), {
        min: 0,
        max: 999
      })

      for (let i = 0; i < returned.length; i++) {
        game.aDraw(player, { age: game.getEffectAge(this, 3) })
      }
    },

    (game, player) => {
      game.aChooseAndMeld(player, game.getCardsByZone(player, 'hand'))
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        game.mLogWasForeseen(self)
        game.aForeshadowMany(player, game.getCardsByZone(player, 'hand'))
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
