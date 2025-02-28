const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Fingerprints`  // Card names are unique in Innovation
  this.name = `Fingerprints`
  this.color = `yellow`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `lshl` 
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay your red or yellow cards left.`,
    `Safeguard an available achievement of value equal to the number of splayed colors on your board. Transfer a card of that value in your hand to any board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aChooseAndSplay(player, ['red', 'yellow'], 'left')
    },
    (game, player) => {
      const splayedColors = ['red', 'yellow', 'blue', 'purple', 'green']
        .filter(color => game.getZoneByPlayer(player, color).splay !== 'none')
        .length
      
      const availableAchievements = game.getAvailableAchievements(splayedColors)
      if (availableAchievements.length > 0) {
        const achievement = game.aChooseCard(player, availableAchievements, {
          title: 'Choose an achievement to safeguard'
        })
        if (achievement) {
          game.aSafeguardAchievement(player, achievement)

          const choices = game
            .getCardsByZone(player, 'hand')
            .filter(card => card.age === splayedColors)

          if (choices.length > 0) {
            const transferTo = game.aChoosePlayer(player, null, {
              title: 'Choose a player to transfer card to'
            })
            const card = game.aChooseCard(player, choices, {
              title: 'Choose a card to transfer'
            })
            game.aTransfer(player, card, game.getZoneByPlayer(transferTo, card.color))
          }
          else {
            game.mLogNoEffect()  
          }
        }
      }
      else {
        game.mLogNoEffect()
      }
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