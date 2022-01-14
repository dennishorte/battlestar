const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Cai Lun`  // Card names are unique in Innovation
  this.name = `Cai Lun`
  this.color = `yellow`
  this.age = 2
  this.expansion = `figs`
  this.biscuits = `&cch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `You may splay one color of your cards left.`
  this.karma = [
    `If you would claim an achievement, first draw and foreshadow a {3}.`,
    `Each card in your forecast counts as an available achievement for you.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = [
    {
      karma: `You may splay one color of your cards left.`,
      steps: [
        {
          description: 'Choose up to one color to splay left',
          func(context, player) {
            const { game } = context
            return game.aChooseAndSplay(context, {
              playerName: player.name,
              direction: 'left',
            })
          }
        },
      ],
    }
  ]
  this.inspireImpl = []
  this.karmaImpl = [
    {
      karma: `If you would claim an achievement, first draw and foreshadow a {3}.`,
      trigger: 'claim-achievement',
      kind: 'would-first',
      checkApplies: () => true,
      steps: [
        {
          description: `If you would claim an achievement, first draw and foreshadow a {3}.`,
          func(context, player) {
            const { game } = context
            return game.aDrawAndForecast(context, player, 3)
          }
        }
      ]
    },
    {
      karma: `Each card in your forecast counts as an available achievement for you.`,
      trigger: 'list-achievements',
      kind: 'each',
      checkApplies: () => true,
      func(game, player) {
        return game
          .getForecast(player)
          .cards
      }
    },
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
