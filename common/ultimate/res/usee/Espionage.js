const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Espionage`  
  this.name = `Espionage`
  this.color = `blue`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `khkk` 
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you reveal a card in your hand. If you do, and I have no card in my hand of the same color, transfer it to my hand, then repeat this effect!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      while (true) {
        const hand = game.getCardsByZone(player, 'hand')
        const choices = hand.map(c => c.id)

        const revealedId = game.aChoose(player, choices, {
          title: 'Choose a card to reveal',
          min: 0, 
          max: 1
        })[0]

        if (!revealedId) break

        const revealedCard = hand.find(c => c.id === revealedId)
        game.mReveal(player, revealedCard)

        const leaderHand = game.getCardsByZone(leader, 'hand')
        if (!leaderHand.some(c => c.color === revealedCard.color)) {
          game.mTransfer(player, revealedCard, game.getZoneByPlayer(leader, 'hand'))
        }
        else {
          break
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