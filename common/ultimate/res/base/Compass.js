const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Compass`  // Card names are unique in Innovation
  this.name = `Compass`
  this.color = `green`
  this.age = 3
  this.expansion = `base`
  this.biscuits = `hccl`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a top non-green card with {l} from your board to my board, and then meld a top card without {l} from my board!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const leafChoices = game
        .getTopCards(player)
        .filter(card => card.color !== 'green')
        .filter(card => card.checkHasBiscuit('l'))

      const card = game.actions.chooseCard(player, leafChoices)
      if (card) {
        game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
      }

      const nonLeafChoices = game
        .getTopCards(leader)
        .filter(card => !card.checkHasBiscuit('l'))

      const card2 = game.actions.chooseCard(player, nonLeafChoices)
      if (card2) {
        game.aMeld(player, card2)
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
