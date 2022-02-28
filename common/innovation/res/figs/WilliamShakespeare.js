const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `William Shakespeare`  // Card names are unique in Innovation
  this.name = `William Shakespeare`
  this.color = `purple`
  this.age = 4
  this.expansion = `figs`
  this.biscuits = `4*hs`
  this.dogmaBiscuit = `s`
  this.inspire = `Meld a card from your hand.`
  this.echo = ``
  this.karma = [
    `You may issue a Rivaly Decree with any two figures.`,
    `Each HEX on your board provides one additional point toward your score.`
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
      decree: 'Rivalry',
    },
    {
      trigger: 'calculate-score',
      func: (game, player) => {
        let count = 0
        for (const color of game.utilColors()) {
          const zone = game.getZoneByPlayer(player, color)
          const cards = zone.cards()
          for (const card of cards) {
            const splay = cards[0] === card ? 'top' : zone.splay
            if (card.checkBiscuitIsVisible('h', splay)) {
              count += 1
            }
          }
        }
        return count
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
