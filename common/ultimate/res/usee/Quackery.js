const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Quackery`  // Card names are unique in Innovation
  this.name = `Quackery`
  this.color = `blue`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `hsfs`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose to either score a card from your hand, or draw a {4}.`,
    `Reveal and return exactly two cards in your hand. If you do, draw a card of value equal to the sum number of {l} and {s} on the returned cards.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = [
        'Draw a ' + game.getEffectAge(this, 4),
      ]

      const hand = game.getCardsByZone(player, 'hand').map(c => c.name)
      if (hand.length > 0) {
        choices.push({
          title: 'Score',
          choices: hand,
          min: 0,
        })
      }

      const selected = game.aChoose(player, choices, { title: 'Choose an option:' })[0]

      if (selected === 'Draw a 4') {
        game.aDraw(player, { age: game.getEffectAge(this, 4) })
      }
      else {
        const card = game.getCardByName(selected.selection[0])
        game.aScore(player, card)
      }
    },
    (game, player) => {
      const hand = game.getCardsByZone(player, 'hand')

      if (hand.length < 2) {
        game.log.addNoEffect()
        return
      }

      const revealed = game.aChooseAndReveal(player, hand, { count: 2, ordered: true })
      const returned = game.aReturnMany(player, revealed)

      if (returned.length === 2) {
        const leafCount = returned.map(c => c.getBiscuitCount('l')).reduce((x, acc) => x + acc, 0)
        const bulbCount = returned.map(c => c.getBiscuitCount('s')).reduce((x, acc) => x + acc, 0)
        const drawAge = leafCount + bulbCount

        game.aDraw(player, { age: drawAge })
      }
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
