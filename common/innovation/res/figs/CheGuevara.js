const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Che Guevara`  // Card names are unique in Innovation
  this.name = `Che Guevara`
  this.color = `yellow`
  this.age = 9
  this.expansion = `figs`
  this.biscuits = `hl&l`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Draw and score a {9}.`
  this.karma = [
    `When you meld this card, score all opponents' top figures.`,
    `If you would score a green card, instead remove it and all cards in all score piles from the game.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    game.aDrawAndScore(player, game.getEffectAge(this, 9))
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'when-meld',
      func: (game, player) => {
        const cards = game
          .getPlayerOpponents(player)
          .flatMap(opp => game.getTopCards(opp))
          .filter(card => card.expansion === 'figs')
        game.aScoreMany(player, cards)
      }
    },

    {
      trigger: 'score',
      kind: 'would-instead',
      matches: (game, player, { card }) => card.color === 'green',
      func: (game, player, { card }) => {
        const cards = game
          .getPlayerAll()
          .flatMap(player => game.getCardsByZone(player, 'score'))
        cards.push(card)
        game.aRemoveMany(player, cards)
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
