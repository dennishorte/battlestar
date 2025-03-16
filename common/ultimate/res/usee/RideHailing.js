const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ride-Hailing`  // Card names are unique in Innovation
  this.name = `Ride-Hailing`
  this.color = `yellow`
  this.age = 10
  this.expansion = `usee`
  this.biscuits = `iiih`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay your green cards up.`,
    `Meld a top non-yellow card with {i} from another player's board. If you do, self-execute it. Otherwise, draw an {e}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aChooseAndSplay(player, ['green'], 'up')
    },
    (game, player) => {
      const choices = game
        .getPlayersOther(player)
        .flatMap(opp => game.getTopCards(opp))
        .filter(card => card.color !== 'yellow' && card.checkHasBiscuit('i'))

      const card = game.aChooseAndMeld(player, choices)[0]

      if (card) {
        game.aSelfExecute(player, card)
      }
      else {
        game.aDraw(player, { age: game.getEffectAge(this, 11) })
      }
    }
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
