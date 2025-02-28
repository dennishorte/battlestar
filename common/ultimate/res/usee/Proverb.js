const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Proverb`  // Card names are unique in Innovation
  this.name = `Proverb`
  this.color = `blue`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `hckk` 
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw, reveal, and return a [1]. If the color of the returned card is yellow or purple, safeguard an available achievement of value equal to your hand size. If you do, then return all cards from your hand. Otherwise, draw two [1].`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 1))
      
      const returned = game.aReturn(player, card)
      if (returned) {
        if (card.color === 'yellow' || card.color === 'purple') {
          const handSize = game.getCardsByZone(player, 'hand').length
          const achievement = game.getAvailableAchievement(handSize)

          if (achievement) {
            const safeguarded = game.aSafeguard(player, achievement)
            
            if (safeguarded) {
              game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
            }  
          }
        } 
        else {
          game.aDraw(player, { age: game.getEffectAge(this, 1) })
          game.aDraw(player, { age: game.getEffectAge(this, 1) })
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