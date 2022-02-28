const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Invention`  // Card names are unique in Innovation
  this.name = `Invention`
  this.color = `green`
  this.age = 4
  this.expansion = `base`
  this.biscuits = `hssf`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay right any one color of your cards currently splayed left. If you do, draw and score a {4}.`,
    `If you have five colors splayed, each in any direction, claim the Wonder achievement.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const splayedLeft = game
        .utilColors()
        .filter(color => game.getZoneByPlayer(player, color).splay === 'left')
      const color = game.aChooseAndSplay(player, splayedLeft, 'right')
      if (color) {
        game.aDrawAndScore(player, game.getEffectAge(this, 4))
      }
    },

    (game, player) => {
      const splayCount = game
        .utilColors()
        .filter(color => game.getZoneByPlayer(player, color).splay !== 'none')
        .length

      if (splayCount === 5) {
        game.aClaimAchievement(player, { name: 'Wonder' })
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
