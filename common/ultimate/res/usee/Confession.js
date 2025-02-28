const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Confession`  // Card names are unique in Innovation
  this.name = `Confession`
  this.color = `purple`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `ccch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a top card with {f} of each color from your board. If you return none, meld a card from your score pile, then draw and score a {4}.`,
    `Draw a {4} for each {f} in your score pile.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const topCards = game.getTopCards(player)
      const chosenCards = game.aChooseAndReturn(player, topCards.filter(card => card.biscuits.includes('f')), { min: 0, max: 4 })
      
      if (chosenCards.length === 0) {
        const scorePile = game.getZoneByPlayer(player, 'score')
        game.aChooseAndMeld(player, scorePile.cards(), { min: 1, max: 1 })
        game.aDrawAndScore(player, game.getEffectAge(this, 4))
      }
    },
    (game, player) => {
      const scorePile = game.getZoneByPlayer(player, 'score')
      const numBiscuits = scorePile.cards().reduce((total, card) => total + card.biscuits.split('').filter(b => b === 'f').length, 0)

      game.aDraw(player, { age: game.getEffectAge(this, 4), count: numBiscuits })
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