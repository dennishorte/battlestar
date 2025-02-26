const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Novel`  // Card names are unique in Innovation
  this.name = `Novel`
  this.color = `purple`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `h3c&`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `Draw a {3}.`
  this.karma = []
  this.dogma = [
    `Draw a {3}. You may splay your purple cards left.`,
    `If all your non-purple top cards share a common icon other than {c}, claim the Supremacy achievement.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDraw(player, { age: game.getEffectAge(this, 3) })
      game.aChooseAndSplay(player, ['purple'], 'left')
    },

    (game, player) => {
      if (!game.checkAchievementAvailable('Supremacy')) {
        game.mLogNoEffect()
        return
      }

      const biscuits = game
        .getTopCards(player)
        .filter(card => card.color !== 'purple')
        .map(card => card.biscuits)

      if (biscuits.length === 0) {
        game.mLogNoEffect()
        return
      }

      for (const biscuit of Object.keys(game.utilEmptyBiscuits())) {
        if (biscuit === 'c') {
          continue
        }

        if (biscuits.every(b => b.includes(biscuit))) {
          game.aClaimAchievement(player, { name: 'Supremacy' })
          return
        }
      }

      game.mLogNoEffect()
    }
  ]
  this.echoImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 3) })
  }
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
