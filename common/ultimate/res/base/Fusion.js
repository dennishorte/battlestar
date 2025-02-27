const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Fusion`  // Card names are unique in Innovation
  this.name = `Fusion`
  this.color = `red`
  this.age = 11
  this.expansion = `base`
  this.biscuits = `iiih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Score a top card of value 11 on your board. If you do, choose a value one or two lower than the scored card, then repeat this dogma effect using the chosen value.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const executeEffect = (value) => {
        const choices = game
          .getTopCards(player)
          .filter(card => card.getAge() === value)

        return game.aChooseAndScore(player, choices)[0]
      }

      let value = 11
      while (true) {
        const card = executeEffect(value)

        if (!card) {
          break
        }

        const options = [value - 2, value - 1]
          .filter(v => game.checkAgeZeroInPlay() ? v >= 0 : v >= 1)

        if (options.length === 0) {
          game.mLog({ template: 'Player has reached the minimum age' })
          break
        }

        value = game.aChooseAge(player, options, {
          title: 'Choose next value to return',
        })
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
