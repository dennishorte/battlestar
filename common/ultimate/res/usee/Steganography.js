const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Steganography`  // Card names are unique in Innovation
  this.name = `Steganography`
  this.color = `purple`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `hkkk`
  this.dogmaBiscuit = `h`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay left a color on your board with [k]. If you do, safeguard an available achievement of value equal to the number of cards of that color on your board. Otherwise, draw and tuck a [3].`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getColorsInZoneForPlayer(player, 'board')
        .filter(color => game.getZoneByPlayer(player, color).cards().some(card => card.checkHasBiscuit('k')))

      const color = game.aChooseCard(player, choices, { 
        title: 'Choose a color to splay left',
        min: 0, 
        max: 1
      })

      if (color) {
        const splay = game.aSplay(player, color, 'left')
        if (splay) {
          const cardCount = game.getZoneByPlayer(player, color).cards().length
          const achievements = game.getAvailableAchievements(cardCount)

          const achievement = game.aChooseCard(player, achievements, {
            title: 'Choose an achievement to safeguard',
            min: 1,
            max: 1
          })

          if (achievement) {
            game.aSafeguard(player, achievement)
          }
        }
      }
      else {
        const age = game.getEffectAge(this, 3) 
        const card = game.aDraw(player, { age })
        game.aTuck(player, card)
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