const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Gujin Tushu Jinsheng`  // Card names are unique in Innovation
  this.name = `Gujin Tushu Jinsheng`
  this.color = `yellow`
  this.age = 5
  this.expansion = `arti`
  this.biscuits = `schs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If Gujin Tushu Jinsheng is on your board, choose any other top card on any other board. Execute the echo and dogma effects on the chosen card as if they were on this card. Do not share them.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      if (!this.checkIsOnPlayerBoard(player)) {
        game.log.add({
          template: "{card} is not on {player}'s board.",
          args: { card: this, player }
        })
        return
      }

      const choices = game
        .players
        .other(player)
        .flatMap(player => game.getTopCards(player))
      const card = game.aChooseCard(player, choices)
      if (card) {
        game.aExecuteAsIf(player, card)
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
