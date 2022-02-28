const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Classification`  // Card names are unique in Innovation
  this.name = `Classification`
  this.color = `green`
  this.age = 6
  this.expansion = `base`
  this.biscuits = `sssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal the color of a card from your hand. Take into your hand all cards of that color from all opponent's hands. Then, meld all cards of that color from your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const revealed = game.aChooseCard(player, game.getZoneByPlayer(player, 'hand').cards())
      if (revealed) {
        game
          .mReveal(player, revealed)

        // Take cards into hand
        game
          .getPlayerOpponents(player)
          .flatMap(opp => game.getZoneByPlayer(opp, 'hand').cards())
          .filter(card => card.color === revealed.color)
          .forEach(card => game.mTake(player, card))

        // Meld cards
        const cardsToMeld = game
          .getZoneByPlayer(player, 'hand')
          .cards()
          .filter(card => card.color === revealed.color)

        game.aMeldMany(player, cardsToMeld)
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
