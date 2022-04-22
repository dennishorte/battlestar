const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../game.js')

function Card() {
  this.id = `Gene Roddenberry`  // Card names are unique in Innovation
  this.name = `Gene Roddenberry`
  this.color = `purple`
  this.age = 9
  this.expansion = `figs`
  this.biscuits = `ch&9`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `Meld a top purple card from anywhere.`
  this.karma = [
    `If you would meld a purple card, instead if it is Enterprise, you win. Otherwise, instead tuck the card and return any top figure.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    const purples = game
      .getPlayerAll()
      .map(player => game.getTopCard(player, 'purple'))
      .filter(card => card !== undefined)
    game.aChooseAndMeld(player, purples)
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        return card.color === 'purple'
      },
      func: (game, player, { card }) => {
        if (card.name === 'Enterprise') {
          throw new GameOverEvent({
            player,
            reason: this.name,
          })
        }
        else {
          game.aTuck(player, card)
          const topFigures = game
            .getPlayerAll()
            .flatMap(player => game.getTopCards(player))
            .filter(card => card.checkIsFigure())
          game.aChooseAndReturn(player, topFigures)
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
