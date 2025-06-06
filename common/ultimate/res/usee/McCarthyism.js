const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `McCarthyism`  // Card names are unique in Innovation
  this.name = `McCarthyism`
  this.color = `red`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `fiih`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw and meld an {8}! If Socialism is a top card on your board, you lose!`,
    `Score your top purple card.`,
    `You may splay your red or blue cards up.`
  ]

  this.dogmaImpl = [
    (game, player, { self }) => {
      game.aDrawAndMeld(player, game.getEffectAge(this, 8))

      const socialism = game
        .getTopCards(player)
        .find(card => card.name === 'Socialism')

      if (socialism) {
        game.log.add({
          template: '{player} has Socialism on their board and loses the game!',
          args: { player }
        })
        game.aYouLose(player, self)
      }
    },

    (game, player) => {
      const purple = game.getTopCard(player, 'purple')
      if (purple) {
        game.aScore(player, purple)
      }
      else {
        game.log.addNoEffect()
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['red', 'blue'], 'up')
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
