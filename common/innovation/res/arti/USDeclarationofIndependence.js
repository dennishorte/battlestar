const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `U.S. Declaration of Independence`  // Card names are unique in Innovation
  this.name = `U.S. Declaration of Independence`
  this.color = `red`
  this.age = 6
  this.expansion = `arti`
  this.biscuits = `ccsh`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer the highest card in your hand to my hand, the highest card in your score pile to my score pile, and the highest top card with a {f} from yor board to my board!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const hand = game.utilHighestCards(game.getCardsByZone(player, 'hand'))
      game.aChooseAndTransfer(player, hand, game.getZoneByPlayer(leader, 'hand'))

      const score = game.utilHighestCards(game.getCardsByZone(player, 'score'))
      game.aChooseAndTransfer(player, score, game.getZoneByPlayer(leader, 'score'))

      const cards = game.utilHighestCards(
        game
          .getTopCards(player)
          .filter(card => card.checkHasBiscuit('f'))
      )
      const card = game.actions.chooseCard(player, cards, { title: 'Choose a top card to transfer' })
      if (card) {
        game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
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
