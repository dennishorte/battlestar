const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Publications`  // Card names are unique in Innovation
  this.name = `Publications`
  this.color = `blue`
  this.age = 7
  this.expansion = `base`
  this.biscuits = `hsis`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may rearrange the order of one color of cards on your board.`,
    `You may splay your yellow or blue cards up.`
  ]

  this.dogmaImpl = [
    {
      dogma: `You may rearrange the order of one color of cards on your board.`,
      steps: [
        {

        }
      ]
    },
    {
      dogma: `You may splay your yellow or blue cards up.`,
      steps: [
        {
          description: `You may splay your yellow or blue cards up.`,
          func(context, player) {
            const { game } = context
            return game.aChooseAndSplay(context, {
              playerName: player.name,
              direction: 'up',
              choices: ['blue', 'yellow']
            })
          }
        }
      ]
    },
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
