const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Flight`  // Card names are unique in Innovation
  this.name = `Flight`
  this.color = `red`
  this.age = 8
  this.expansion = `base`
  this.biscuits = `chic`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If your red cards are splayed up, you may splay any one color of your cards up.`,
    `You may splay your red cards up.`
  ]

  this.dogmaImpl = [
    {
      dogma: `If your red cards are splayed up, you may splay any one color of your cards up.`,
      steps: [
        {
          description: `You may splay your red cards up.`,
          func(context, player) {
            const { game } = context
            const red = game.getZoneColorByPlayer(player, 'red')
            if (red.splay === 'up') {
              return game.aChooseAndSplay(context, {
                playerName: player.name,
                direction: 'up'
              })
            }
          }
        }
      ]
    },
    {
      dogma: `You may splay your red cards up.`,
      steps: [
        {
          description: `You may splay your red cards up.`,
          func(context, player) {
            const { game } = context
            return game.aChooseAndSplay(context, {
              playerName: player.name,
              choices: ['red'],
              direction: 'up'
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
