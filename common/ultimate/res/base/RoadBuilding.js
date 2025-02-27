const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Road Building`  // Card names are unique in Innovation
  this.name = `Road Building`
  this.color = `red`
  this.age = 2
  this.expansion = `base`
  this.biscuits = `kkhk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld one or two cards from your hand. If you meld two, you may transfer your top red card to another player's board. If you do, meld that player's top green card.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      // Meld one or two cards
      const cards = game.aChooseAndMeld(player, game.getCardsByZone(player, 'hand'), { min: 1, max: 2 })

      // If melded two...
      if (cards && cards.length === 2) {

        // Choose an opponent to swap with
        const choices = game
          .getPlayerAll()
          .filter(other => other !== player)
        const title = 'Choose a player to transfer your top red card to'
        const opp = game.aChoosePlayer(player, choices, { title, min: 0, max: 1 })

        // If you chose to swap, do it.
        if (opp) {
          const topRed = game.getTopCard(player, 'red')

          if (topRed) {
            game.aTransfer(player, topRed, game.getZoneByPlayer(opp, 'red'))

            // After transferring, meld their top green card
            const topGreen = game.getTopCard(opp, 'green')
            if (topGreen) {
              game.aMeld(player, topGreen)
            }
          }
        }
        else {
          game.mLog({
            template: '{player} chooses not to transfer cards',
            args: { player }
          })
        }
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
