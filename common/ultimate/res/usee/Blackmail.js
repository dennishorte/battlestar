const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Blackmail`  // Card names are unique in Innovation
  this.name = `Blackmail`
  this.color = `green`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `hffl`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you reveal your hand! Meld a revealed card of my choice! Reveal your score pile! Self-execute a card revealed due to this effect of my choice, replacing 'may' with 'must'!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      // Reveal opponent's hand
      const hand = game.getCardsByZone(player, 'hand')
      game.aRevealMany(player, hand)
      const toMeld = game.aChooseCard(leader, hand, {
        title: 'Choose a card for your opponent to meld',
      })

      if (toMeld) {
        game.aMeld(player, toMeld)
      }

      // Reveal opponent's score pile
      const score = game.getCardsByZone(player, 'score')
      game.aRevealMany(player, score)

      const choices = [...score, ...hand]
      const toExecute = game.aChooseCard(leader, choices, {
        title: 'Choose a card to force opponent to self-execute',
      })
      if (toExecute) {
        game.log.add({ template: `Replacing 'may' with 'must' is almost certainly buggy. Tell Dennis what goes wrong.` })
        game.state.dogmaInfo.mayIsMust = true
        game.aSelfExecute(player, toExecute)
        game.state.dogmaInfo.mayIsMust = false
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
