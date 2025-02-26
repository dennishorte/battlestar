const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Erwin Rommel`  // Card names are unique in Innovation
  this.name = `Erwin Rommel`
  this.color = `red`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `fhf&`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Transfer a card from any score pile to yours.`
  this.karma = [
    `You may issue a War Decree with any two figures.`,
    `If you would score a card, instead score the top card of its color from all boards.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    const choices = game
      .getPlayerAll()
      .filter(other => other !== player)
      .flatMap(player => game.getCardsByZone(player, 'score'))
    game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(player, 'score'), { hidden: true })
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'score',
      kind: 'would-instead',
      matches: () => true,
      func: (game, player, { card }) => {
        const cards = game
          .getPlayerAll()
          .flatMap(player => game.getTopCards(player))
          .filter(other => other.color === card.color)
        game.aScoreMany(player, cards)
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
