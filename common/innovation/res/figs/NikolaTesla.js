const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Nikola Tesla`  // Card names are unique in Innovation
  this.name = `Nikola Tesla`
  this.color = `yellow`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `8*sh`
  this.dogmaBiscuit = `s`
  this.inspire = `Draw an {8}.`
  this.echo = ``
  this.karma = [
    `You may issue an Expansion Decree with any two figures.`,
    `If you would meld a card with a {s} or {i}, first score an opponent's top card with neither {s} nor {i}.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 8) })
  }
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion',
    },
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: (game, player, { card }) => card.checkHasBiscuit('s') || card.checkHasBiscuit('i'),
      func: (game, player) => {
        const choices = game
          .getPlayerOpponents(player)
          .flatMap(opp => game.getTopCards(opp))
          .filter(card => !card.checkHasBiscuit('s') && !card.checkHasBiscuit('i'))
        game.aChooseAndScore(player, choices)
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
