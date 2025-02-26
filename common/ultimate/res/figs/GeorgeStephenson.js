const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `George Stephenson`  // Card names are unique in Innovation
  this.name = `George Stephenson`
  this.color = `green`
  this.age = 7
  this.expansion = `figs`
  this.biscuits = `7&fh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `You may splay up a color you have splayed right.`
  this.karma = [
    `If you would claim an achievement, first transfer the bottom card from each non-empty age below 10 to the available achievements.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    const rightColors = game
      .utilColors()
      .filter(color => game.getZoneByPlayer(player, color).splay === 'right')
    game.aChooseAndSplay(player, rightColors, 'up')
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        for (let i = 1; i < 10; i++) {
          const deck = game.getZoneByDeck('base', i)
          const cards = deck.cards()
          if (cards.length > 0) {
            const card = cards[cards.length - 1]
            game.mTransfer(player, card, game.getZoneById('achievements'))
          }
        }
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
