const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sniping`  // Card names are unique in Innovation
  this.name = `Sniping`
  this.color = `red`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `ffhf`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you unsplay the color on your board of my choice! Meld your bottom card of that color! Transfer your bottom non-top card of that color to my board!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const colors = ['red', 'blue', 'green', 'yellow', 'purple']
      const chosenColor = game.aChooseColor(leader, colors, { title: 'Choose a color' })
      
      game.mLog({
        template: '{leader} demands {player} unsplay their {color} pile',
        args: { leader, player, color: chosenColor }
      })
      
      game.aUnsplay(player, chosenColor)

      const cards = game.getCardsByZone(player, chosenColor)
      if (cards.length > 0) {
        const bottomCard = cards[0]
        game.aMeld(player, bottomCard)
        game.mLog({
          template: '{player} melds {card} from the bottom of their {color} pile',
          args: { player, card: bottomCard, color: chosenColor }
        })

        if (cards.length > 1) {
          const bottomNonTop = cards[1]
          game.aTransfer(player, bottomNonTop, game.getZoneByPlayer(leader, chosenColor))
          game.mLog({
            template: '{player} transfers {card} to {leader}\'s board',
            args: { player, card: bottomNonTop, leader }
          })
        }
      }
    },
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