const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Evolution`  // Card names are unique in Innovation
  this.name = `Evolution`
  this.color = `blue`
  this.age = 7
  this.expansion = `base`
  this.biscuits = `sssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may choose to either draw and score and {8} and then return a card from your score pile, or draw a card of value one higher than the highest card in your score pile.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const selection = game.aChoose(player, ['Draw and Score and Return', 'Draw a Higher Card'])[0]
      game.mLog({
        template: '{player} chooses {option}',
        args: { player, option: selection }
      })

      if (selection === 'Draw and Score and Return') {
        game.aDrawAndScore(player, game.getEffectAge(this, 8))
        game.aChooseAndReturn(player, game.getCardsByZone(player, 'score'))
      }
      else {
        const highest = game.utilHighestCards(game.getCardsByZone(player, 'score'))
        if (highest.length > 0) {
          game.aDraw(player, { age: highest[0].age + 1 })
        }
        else {
          game.aDraw(player, { age: 1 })
        }
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
