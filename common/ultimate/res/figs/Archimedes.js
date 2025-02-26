const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Archimedes`  // Card names are unique in Innovation
  this.name = `Archimedes`
  this.color = `blue`
  this.age = 2
  this.expansion = `figs`
  this.biscuits = `sh&s`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a {2}.`
  this.karma = [
    `You may issue an Advancement Decree with any two figures.`,
    `If you would take a Dogma action, first increase every {} value in each echo and dogma effect by one.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 2) })
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement'
    },
    {
      trigger: 'dogma',
      karmaKind: 'would-first',
      matches: () => true,
      func(game, player, card, age) {
        game.state.dogmaInfo.globalAgeIncrease = 1
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
