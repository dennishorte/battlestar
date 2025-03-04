const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Brethren of Purity`  // Card names are unique in Innovation
  this.name = `Brethren of Purity`
  this.color = `blue` 
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `sslh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a {3} or a card of value one higher than the last card melded due to Brethren of Purity during this action. If you meld over a card with a l, repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      let lastMeldedAge = game.getEffectAge(this, 3)
      
      while (true) {
        const choices = [lastMeldedAge, lastMeldedAge + 1]
          .filter(age => game.getDrawableAges(player).includes(age))
        
        if (choices.length === 0) {
          game.mLogNoEffect()
          break
        }
        
        const age = game.aChooseAge(player, choices)
        const card = game.aDrawAndMeld(player, age)
        lastMeldedAge = card.age
        
        const meldedOver = game
          .getPlayerBoard(player)
          .getZone(card.color)
          .cards()
          .find(c => c.id !== card.id)
        
        if (!meldedOver || !meldedOver.checkHasBiscuit('l')) {
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