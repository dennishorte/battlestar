const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tecumseh`  // Card names are unique in Innovation
  this.name = `Tecumseh`
  this.color = `red`
  this.age = 6
  this.expansion = `figs`
  this.biscuits = `fh&f`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Draw and tuck a {6}.`
  this.karma = [
    `If you would tuck a card with a {f}, first return a top card with a {f} from another player's board.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    game.aDrawAndTuck(player, game.getEffectAge(this, 6))
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'tuck',
      kind: 'would-first',
      matches: (game, player, { card }) => card.checkHasBiscuit('f'),
      func: (game, player) => {
        const choices = game
          .getPlayerAll()
          .filter(other => other !== player)
          .flatMap(player => game.getTopCards(player))
          .filter(card => card.checkHasBiscuit('f'))
        game.aChooseAndReturn(player, choices)
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
