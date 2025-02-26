const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Bartolomeo Cristofori`  // Card names are unique in Innovation
  this.name = `Bartolomeo Cristofori`
  this.color = `purple`
  this.age = 5
  this.expansion = `figs`
  this.biscuits = `l*hl`
  this.dogmaBiscuit = `l`
  this.inspire = `Meld a card from your hand.`
  this.echo = ``
  this.karma = [
    `If you would meld the fifth visible card of a color on your board, first claim an achievement ignoring the scoring restriction.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aChooseAndMeld(player, game.getCardsByZone(player, 'hand'))
  }
  this.karmaImpl = [
    {
      trigger: 'meld',
      kind: 'would-first',
      matches(game, player, { card }) {
        const zone = game.getZoneByPlayer(player, card.color)
        return zone.splay !== 'none' && zone.cards().length === 4
      },
      func(game, player) {
        const choices = game.getEligibleAchievements(player, { ignoreScore: true })
        game.aChooseAndAchieve(player, choices)
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
