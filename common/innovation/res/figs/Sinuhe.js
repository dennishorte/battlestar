const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sinuhe`  // Card names are unique in Innovation
  this.name = `Sinuhe`
  this.color = `purple`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `&llh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Draw and foreshadow a {2} or {3}.`
  this.karma = [
    `You may issue a Rivaly Decree with any two figures.`,
    `Each {k} on your board provides one additional point towards your score.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = [
    {
      dogma: `Draw and foreshadow a {2} or {3}.`,
      steps: [
        {
          description: 'Choose an age to draw and forecast.',
          func(context, player) {
            const { game } = context
            return game.aChoose(context, {
              playerName: player.name,
              kind: 'Age',
              choices: [2, 3]
            })
          }
        },
        {
          description: 'Draw and forecast a card of the chosen age.',
          func(context, player) {
            const { game } = context
            const age = context.sentBack.chosen[0]
            return game.aDrawAndForecast(context, player, age)
          }
        },
      ]
    }
  ]
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
      checkApplies: () => true,
    },
    {
      trigger: 'calculate-score',
      checkApplies: () => true,
      func(game, player) {
        const biscuits = game.getBiscuits(player)
        return biscuits.board.k
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
