const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `John Ericsson`  // Card names are unique in Innovation
  this.name = `John Ericsson`
  this.color = `red`
  this.age = 7
  this.expansion = `figs`
  this.biscuits = `hff*`
  this.dogmaBiscuit = `f`
  this.inspire = `Draw and tuck a {7}.`
  this.echo = ``
  this.karma = [
    `When you meld this card, score all opponents' top figures of value less than 7.`,
    `Each {f} on your board provides two additional {i}.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDrawAndTuck(player, game.getEffectAge(this, 7))
  }
  this.karmaImpl = [
    {
      trigger: 'when-meld',
      func: (game, player) => {
        const figs = game
          .getPlayerOpponents(player)
          .flatMap(opp => game.getTopCards(opp))
          .filter(card => card.expansion === 'figs')
          .filter(card => card.age < 7)
        game.aScoreMany(player, figs)
      }
    },
    {
      trigger: 'calculate-biscuits',
      func: (game, player, { biscuits }) => {
        const output = game.utilEmptyBiscuits()
        output.i = biscuits.f * 2
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
