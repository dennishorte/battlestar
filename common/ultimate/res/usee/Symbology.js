const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Symbology`  // Card names are unique in Innovation
  this.name = `Symbology`
  this.color = `purple`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `sshk`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have at least four each of at least four biscuit on your board, draw a {4}. Otherwise, if you have three of three biscuits, draw a {3}. Otherwise, if you have two of two biscuits, draw a {2}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const biscuits = game.getBiscuits()[player.name]
      const biscuitCounts = [0, 0, 0, 0, 0]

      for (const count of Object.values(biscuits)) {
        if (count >= 4) {
          biscuitCounts[4] += 1
        }
        if (count >= 3) {
          biscuitCounts[3] += 1
        }
        if (count >= 2) {
          biscuitCounts[2] += 1
        }
      }

      game.mLog({ template: 'four biscuits: ' + biscuitCounts[4] })
      game.mLog({ template: 'three biscuits: ' + biscuitCounts[3] })
      game.mLog({ template: 'two biscuits: ' + biscuitCounts[2] })

      if (biscuitCounts[4] >= 4) {
        game.aDraw(player, { age: game.getEffectAge(this, 4) })
      }
      else if (biscuitCounts[3] >= 3) {
        game.aDraw(player, { age: game.getEffectAge(this, 3) })
      }
      else if (biscuitCounts[2] >= 2) {
        game.aDraw(player, { age: game.getEffectAge(this, 2) })
      }
      else {
        game.mLogNoEffect()
      }
    },
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
