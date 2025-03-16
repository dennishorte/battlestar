const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Cell Phone`  // Card names are unique in Innovation
  this.name = `Cell Phone`
  this.color = `yellow`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `ihai`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw a {0} for every two {i} on your board.`,
    `You may splay your green cards up.`,
    `You may tuck any number of cards with a {i} from your hand, splaying up each color you tucked into.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const count = Math.floor(game.getBiscuitsByPlayer(player).i / 2)
      for (let i = 0; i < count; i++) {
        game.aDraw(player, { age: game.getEffectAge(this, 10) })
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['green'], 'up')
    },

    (game, player) => {
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.checkHasBiscuit('i'))
      const tucked = game.aChooseAndTuck(player, choices, { min: 0, max: choices.length, title: 'Choose any number of cards to tuck.' })

      if (tucked) {
        for (const card of tucked) {
          if (game.getZoneByPlayer(player, card.color).splay !== 'up') {
            game.aSplay(player, card.color, 'up')
          }
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
