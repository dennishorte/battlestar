const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pilgrimage`  // Card names are unique in Innovation
  this.name = `Pilgrimage`
  this.color = `green`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `llhl` 
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return a card of value 1 from your hand. If you do, achieve an available achievement of value equal to the returned card, then repeat this effect using a value one higher.`,
    `Draw and tuck all cards in the [1] deck.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      let value = 1
      
      while (true) {
        const choices = game.getCardsByZone(player, 'hand').filter(c => c.age === value)
        const card = game.aChooseAndReturn(player, choices, { min: 0, max: 1 })[0]

        if (!card) {
          break
        }
        
        const availableAchievements = game.getAvailableAchievements(player).filter(a => a.age === value)
        
        if (availableAchievements.length > 0) {
          game.aClaimAchievement(player, availableAchievements[0])
        }
        else {
          game.mLogNoEffect()
          break
        }

        value++
      }
    },
    (game, player) => {
      const age1Deck = game.getZoneById('1')
      const cards = age1Deck.cards()

      game.aTuckMany(player, cards)
      game.aDrawMany(game.getZoneById('1'), cards.length)
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