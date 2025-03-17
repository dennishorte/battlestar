const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Bangle`  // Card names are unique in Innovation
  this.name = `Bangle`
  this.color = `red`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `hk&1`
  this.dogmaBiscuit = `k`
  this.echo = [`Tuck a {1} from your hand.`]
  this.karma = []
  this.dogma = [
    `Choose to either draw and foreshadow a {2} or tuck a {2} from your forecast.`,
    `If you have no cards in your forecast, draw and foreshadow a {3}`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = ['Draw and foreshadow']

      const forecast = game
        .getCardsByZone(player, 'forecast')
        .filter(card => card.getAge() === game.getEffectAge(this, 2))

      if (forecast) {
        choices.push({
          title: 'Tuck from forecast',
          options: forecast,
          min: 0,
        })
      }

      const choice = game.aChoose(player, choices)[0]

      if (choice === choices[0]) {
        game.aDrawAndForeshadow(player, game.getEffectAge(this, 2))
      }
      else {
        const card = game.getCardByName(choice.selection[0])
        game.aTuck(player, card)
      }
    },

    (game, player) => {
      const count = game
        .getCardsByZone(player, 'forecast')
        .length

      if (count === 0) {
        game.aDrawAndForeshadow(player, game.getEffectAge(this, 3))
      }
      else {
        game.mLogNoEffect()
      }
    },
  ]
  this.echoImpl = [
    (game, player) => {
      const cards = game
        .getZoneByPlayer(player, 'hand')
        .cards()
        .filter(card => card.getAge() === game.getEffectAge(this, 1))

      game.aChooseAndTuck(player, cards)
    }
  ]
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
