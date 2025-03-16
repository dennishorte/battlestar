const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Propaganda`
  this.name = `Propaganda`
  this.color = `purple`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `chkk`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you meld a card of the color of my choice from your hand! If you do, transfer the card beneath it to my board!`,
    `Meld a card from your hand.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const chosenColor = game.aChoose(leader, game.utilColors(), {
        title: 'Choose a color',
        count: 1,
      })[0]

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
        const melded = game.aChooseAndMeld(player, choices)[0]
        if (melded) {
          const pile = game.getZoneByPlayer(player, melded.color)
          const cardBeneath = pile.cards()[1]
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
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
