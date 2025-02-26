const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `James Clerk Maxwell`  // Card names are unique in Innovation
  this.name = `James Clerk Maxwell`
  this.color = `blue`
  this.age = 7
  this.expansion = `figs`
  this.biscuits = `h*7i`
  this.dogmaBiscuit = `i`
  this.inspire = `Draw an {8}.`
  this.echo = ``
  this.karma = [
    `Each card in hand provides one additional icon of every type on your board.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 8) })
  }
  this.karmaImpl = [
    {
      trigger: 'calculate-biscuits',
      func: (game, player, { biscuits }) => {
        const bonus = game.getCardsByZone(player, 'hand').length
        const output = game.utilEmptyBiscuits()
        for (const biscuit of Object.keys(biscuits)) {
          if (biscuits[biscuit] > 0) {
            output[biscuit] = bonus
          }
        }
        return output
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
