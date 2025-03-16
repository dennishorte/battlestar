const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Dance`  // Card names are unique in Innovation
  this.name = `Dance`
  this.color = `green`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `llhl`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Transfer a top card on your board with {k} to the board of any other player. If you do, meld the lowest top card without {k} from that player's board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('k'))

      const card = game.aChooseCard(player, choices)
      if (card) {
        const otherPlayers = game
          .getPlayerOpponents(player)

        const targetPlayer = game.aChoosePlayer(player, otherPlayers)
        game.aTransfer(player, card, game.getZoneByPlayer(targetPlayer, card.color))

        const topCastleCards = game
          .getTopCards(targetPlayer)
          .filter(card => !card.checkHasBiscuit('k'))

        const meldChoices = game.utilLowestCards(topCastleCards)

        const meldCard = game.aChooseCard(player, meldChoices, {
          title: 'Choose card to meld',
        })

        if (meldCard) {
          game.aMeld(player, meldCard)
        }
      }
    },
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
