const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Symbology`  // Card names are unique in Innovation
  this.name = `Symbology`
  this.color = `purple`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `sshk`
  this.dogmaBiscuit = `p`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have at least four each of at least four icon on your board, draw a {4}. Otherwise, if you have three of three icons, draw a {3}. Otherwise, if you have two of two icons, draw a {2}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const biscuits = game.getBiscuits()[player.name]
      const icons = ['c', 'f', 'h', 'i', 'k', 'l', 'p', 's'] // All biscuit icons

      // Count number of icons with at least 4 biscuits
      let count4 = icons.reduce((count, icon) => {
        return biscuits[icon] >= 4 ? count + 1 : count
      }, 0)

      if (count4 >= 4) {
        game.aDraw(player, { age: game.getEffectAge(this, 4) })
      }
      else {
        // Count number of icons with at least 3 biscuits
        let count3 = icons.reduce((count, icon) => {
          return biscuits[icon] >= 3 ? count + 1 : count
        }, 0)

        if (count3 >= 3) {
          game.aDraw(player, { age: game.getEffectAge(this, 3) })
        }
        else {
          // Count number of icons with at least 2 biscuits
          let count2 = icons.reduce((count, icon) => {
            return biscuits[icon] >= 2 ? count + 1 : count
          }, 0)

          if (count2 >= 2) {
            game.aDraw(player, { age: game.getEffectAge(this, 2) })
          }
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
