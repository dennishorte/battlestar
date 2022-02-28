const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mobility`  // Card names are unique in Innovation
  this.name = `Mobility`
  this.color = `red`
  this.age = 8
  this.expansion = `base`
  this.biscuits = `hfif`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer your two highest non-red top cards without a {f} from your board to my score pile! If you transferred any cards, draw an {8}!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      let transferred = false
      for (let i = 0; i < 2; i++) {
        const choices = game
          .getTopCards(player)
          .filter(card => card.color !== 'red')
          .filter(card => card.checkHasBiscuit('f'))

        const highest = game.utilHighestCards(choices)
        const cards = game.aChooseAndTransfer(player, highest, game.getZoneByPlayer(leader, 'score'))
        if (cards && cards.length > 0) {
          transferred = true
        }
      }

      if (transferred) {
        game.aDraw(player, { age: game.getEffectAge(this, 8) })
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
