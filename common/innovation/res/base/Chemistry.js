const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Chemistry`  // Card names are unique in Innovation
  this.name = `Chemistry`
  this.color = `blue`
  this.age = 5
  this.expansion = `base`
  this.biscuits = `fsfh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay your blue cards right.`,
    `Draw and score a card of value one higher than the highest top card on your board and then return a card from your score pile.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aChooseAndSplay(player, ['blue'], 'right')
    },

    (game, player) => {
      const decision = game.aYesNo(player, 'Draw and score?')
      if (decision) {
        const age = game.getHighestTopAge(player) + 1
        game.aDrawAndScore(player, age)
        game.aChooseAndReturn(player, game.getZoneByPlayer(player, 'score').cards())
      }
      else {
        game.mLogDoNothing(player)
      }
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
