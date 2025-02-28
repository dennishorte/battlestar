const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sabotage`  // Card names are unique in Innovation
  this.name = `Sabotage`
  this.color = `yellow`
  this.age = 6
  this.expansion = `upae`
  this.biscuits = `hfff` 
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw a {6}! Reveal the cards in your hand! Return the card of my choice from your hand! Tuck your top card and all cards from your score pile of the same color as the returned card!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      // Draw a 6
      game.aDraw(player, { age: game.getEffectAge(this, 6) })

      // Reveal hand
      const cards = game
        .getZoneByPlayer(player, 'hand')
        .cards()
      game.mReveal(player, cards)

      // Leader chooses a card to return
      const choices = cards.map(c => c.id) 
      const card = game.getCardById(game.aChoose(leader, choices, { title: 'Choose card to return' })[0])

      // Return chosen card
      const returned = game.aReturn(player, card)
      
      // Tuck top card of returned color
      const color = returned.color
      const tuckChoices = game
        .getTopCards(player)
        .filter(c => c.color === color)
      if (tuckChoices.length > 0) {
        game.aTuck(player, tuckChoices[0])
      }

      // Tuck score pile cards of returned color  
      const tuckScore = game
        .getCardsByZone(player, 'score')
        .filter(c => c.color === color)
      game.aTuckMany(player, tuckScore)
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