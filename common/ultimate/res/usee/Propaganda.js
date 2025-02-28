const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Propaganda`  
  this.name = `Propaganda`
  this.color = `purple`
  this.age = 2
  this.expansion = `base`  
  this.biscuits = `chkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you meld a card of the color of my choice from your hand! If you do, transfer the card beneath it to my board!`,
    `Meld a card from your hand.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const colors = ['red', 'blue', 'yellow', 'purple', 'green']
      const chosenColor = game.aChoose(leader, colors, { title: 'Choose a color' })

      game.mLog({
        template: '{leader} demands {player} meld a {color} card',
        args: { leader, player, color: chosenColor }
      })

      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.color === chosenColor)

      if (choices.length === 0) {
        game.mLog({
          template: '{player} does not have a {color} card to meld',
          args: { player, color: chosenColor }  
        })
      }
      else {
        const melded = game.aChooseAndMeld(player, choices)
        if (melded) {
          const pile = game.getZoneByPlayer(player, melded.color)
          const cardBeneath = pile.cards()[pile.cards().indexOf(melded) + 1]
          if (cardBeneath) {
            game.aTransfer(player, cardBeneath, game.getZoneByPlayer(leader, cardBeneath.color))
          }
          else {
            game.mLog({
              template: 'no card beneath {card} to transfer', 
              args: { card: melded }
            })
          }
        }
      }
    },

    (game, player) => {
      game.aChooseAndMeld(player, game.getCardsByZone(player, 'hand'))
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