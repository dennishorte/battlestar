const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Masquerade`  // Card names are unique in Innovation
  this.name = `Masquerade`
  this.color = `purple`
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `cchk`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Safeguard an available achievement of value equal to the number of cards in your hand. If you do, return all cards of that value from your hand. If you return a {3}, claim the Anonymity achievement.`,
    `You may splay your purple cards left.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const handSize = game.getZoneByPlayer(player, 'hand').cards().length
      const availableAchievements = game.getAvailableAchievements().filter(a => a.age === handSize)
      
      const achievement = game.aChooseCard(player, availableAchievements, {
        title: 'Choose an achievement to safeguard',
        min: 0, 
        max: 1
      })

      if (achievement) {
        game.aSafeguard(player, achievement)

        const toReturn = game.getZoneByPlayer(player, 'hand')
          .cards()
          .filter(c => c.getAge() === handSize)
        
        game.aReturnMany(player, toReturn)

        if (handSize === 3) {
          game.aClaimAchievement(player, game.getCardByName('Anonymity'))
        }
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['purple'], 'left')
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