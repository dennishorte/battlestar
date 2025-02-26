const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sergey Brin`  // Card names are unique in Innovation
  this.name = `Sergey Brin`
  this.color = `green`
  this.age = 10
  this.expansion = `figs`
  this.biscuits = `hii*`
  this.dogmaBiscuit = `i`
  this.inspire = `You may splay one color of your cards up.`
  this.echo = ``
  this.karma = [
    `Each top card on every player's board counts as a card you can activate with a Dogma action.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aChooseAndSplay(player, null, 'up')
  }
  this.karmaImpl = [
    {
      trigger: 'list-effects',
      func: (game, player) => {
        return game
          .getPlayerAll()
          .flatMap(player => game.getDogmaTargets(player))
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
