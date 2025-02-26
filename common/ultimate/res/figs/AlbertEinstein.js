const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Albert Einstein`  // Card names are unique in Innovation
  this.name = `Albert Einstein`
  this.color = `blue`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `hs&8`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Meld all cards from your hand with a {s} or {i}.`
  this.karma = [
    `You may issue an Advancement Decree with any two figures.`,
    `Each {} value in any of your effects counts as a {0}.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = [
    (game, player) => {
      const cards = game
        .getZoneByPlayer(player, 'hand')
        .cards()
        .filter(card => card.biscuits.includes('s') || card.biscuits.includes('i'))

      game.aMeldMany(player, cards)
    }
  ]
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement'
    },
    {
      trigger: 'effect-age',
      func(game, player, card, age) {
        return 10
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
