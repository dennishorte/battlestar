const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Illuminati`  // Card names are unique in Innovation
  this.name = `Illuminati`
  this.color = `purple`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `shss`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal a card in your hand. Splay the card's color on your board right. Safeguard the top card on your board of that color. Safeguard an available achievement of value one higher than the secret.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const hand = game.getZoneByPlayer(player, 'hand').cards()
      const card = game.aChooseCard(player, hand, { title: 'Choose a card to reveal' })
      
      if (card) {
        game.mReveal(player, card)
        game.aSplay(player, card.color, 'right')
        
        const topCard = game.getTopCard(player, card.color)
        game.mSafeguard(player, topCard)
        
        const availableAchievements = game.getAvailableAchievements()
        const higherAchievement = availableAchievements.find(a => a.age === card.age + 1)
        
        if (higherAchievement) {
          game.mSafeguard(player, higherAchievement)
        }
        else {
          game.mLog({
            template: 'No available achievement of value {age} to safeguard',
            args: { age: card.age + 1 }
          })
        }
      }
      else {
        game.mLogDoNothing(player)
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