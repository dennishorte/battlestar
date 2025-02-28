const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pen Name`  // Card names are unique in Innovation
  this.name = `Pen Name`
  this.color = `purple`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `fhfs`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose to either splay an unsplayed non-purple color on your board left and self-execute its top card, or meld a card from your hand and splay its color on your board right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = ['Splay left', 'Meld and splay right']
      const choice = game.aChoose(player, choices, { title: 'Choose one:' })

      if (choice === choices[0]) {
        // Splay left and self-execute
        const unsplayedColors = ['red', 'green', 'yellow', 'blue'].filter(color => 
          color !== 'purple' && game.getZoneByPlayer(player, color).splay === null
        )
        const color = game.aChooseColor(player, unsplayedColors)
        if (color) {
          game.aSplay(player, color, 'left')
          const topCard = game.getTopCard(player, color)
          if (topCard) {
            game.mLog({
              template: '{player} self-executes {card}',
              args: { player, card: topCard }
            })
            game.aCardEffects(player, topCard, 'dogma', { leader: player })
          }
        }
      }
      else if (choice === choices[1]) {
        // Meld from hand and splay right
        const card = game.aChooseCard(player, game.getCardsByZone(player, 'hand'), {
          title: 'Choose a card to meld'
        })
        if (card) {
          game.aMeld(player, card)
          game.aSplay(player, card.color, 'right')
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