const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Sunglasses`  // Card names are unique in Innovation
  this.name = `Sunglasses`
  this.color = `purple`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `h3&k`
  this.dogmaBiscuit = `k`
  this.echo = `Score a card from your hand of a color you have splayed.`
  this.karma = []
  this.dogma = [
    `You may either splay your purple cards in the direction one of your other colors is splayed, or you may splay one of your other colors in the direction that your purple cars are splayed.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const purpleSplay = game.getZoneByPlayer(player, 'purple').splay
      const existingSplays = game
        .utilColors()
        .filter(color => color !== 'purple')
        .map(color => game.getZoneByPlayer(player, color).splay)
        .filter(splay => splay !== 'none')
        .filter(splay => splay !== purpleSplay)
      const purpleChoices = util.array.distinct(existingSplays)

      const choices = []

      if (game.getCardsByZone(player, 'purple').length > 1) {
        purpleChoices
          .map(splay => `purple ${splay}`)
          .forEach(choice => choices.push(choice))
      }

      if (purpleSplay !== 'none') {
        for (const color of game.utilColors()) {
          if (color === 'purple') {
            continue
          }
          const splay = game.getZoneByPlayer(player, color).splay
          if (splay !== purpleSplay) {
            choices.push(`${color} ${purpleSplay}`)
          }
        }
      }

      const action = game.aChoose(player, choices, { title: 'Choose a color to splay', min: 0, max: 1 })[0]
      if (action) {
        const [color, direction] = action.split(' ')
        game.aSplay(player, color, direction)
      }
    }
  ]
  this.echoImpl = (game, player) => {
    const splayedColors = game
      .utilColors()
      .filter(color => game.getZoneByPlayer(player, color).splay !== 'none')
    const choices = game
      .getCardsByZone(player, 'hand')
      .filter(card => splayedColors.includes(card.color))
    game.aChooseAndScore(player, choices)
  }
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
