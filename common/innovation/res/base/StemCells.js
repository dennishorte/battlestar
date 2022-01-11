const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Stem Cells`  // Card names are unique in Innovation
  this.name = `Stem Cells`
  this.color = `yellow`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `hlll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may score all cards from your hand. If you score one, you must score them all.`
  ]

  this.dogmaImpl = [
    {
      dogma: `You may score all cards from your hand. If you score one, you must score them all.`,
      steps: [
        {
          description: 'You may score all cards from your hand.',
          func(context, player) {
            return context.done()
          }
        },
      ]
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
