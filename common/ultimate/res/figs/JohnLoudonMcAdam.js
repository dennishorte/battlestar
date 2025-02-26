const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `John Loudon McAdam`  // Card names are unique in Innovation
  this.name = `John Loudon McAdam`
  this.color = `yellow`
  this.age = 6
  this.expansion = `figs`
  this.biscuits = `hf*f`
  this.dogmaBiscuit = `f`
  this.inspire = `Meld a card from your hand.`
  this.echo = ``
  this.karma = [
    `You may issue an Expansion Decree with any two figures.`,
    `Each top card with a {f} on your board counts as an available achievement for you.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aChooseAndMeld(player, game.getCardsByZone(player, 'hand'))
  }
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion',
    },
    {
      trigger: 'list-achievements',
      func: (game, player) => {
        return game
          .getTopCards(player)
          .filter(card => card.biscuits.includes('f'))
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
