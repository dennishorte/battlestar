const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Niccolo Machiavelli`  // Card names are unique in Innovation
  this.name = `Niccolo Machiavelli`
  this.color = `purple`
  this.age = 4
  this.expansion = `figs`
  this.biscuits = `&ssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Splay one color right that you have splayed left.`
  this.karma = [
    `Each color splayed right on your board but not splayed in any direction on any other player's board counts as an achievement.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = [
    (game, player) => {
      const choices = game
        .utilColors()
        .filter(color => game.getZoneByPlayer(player, color).splay === 'left')
      game.aChooseAndSplay(player, choices, 'right', { count: 1 })
    }
  ]
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'extra-achievements',
      func: (game, player) => {
        const othersSplayedColors = game
          .getPlayerAll()
          .filter(other => other !== player)
          .flatMap(other => {
            return game
              .utilColors()
              .filter(color => game.getZoneByPlayer(other, color).splay !== 'none')
          })
        return game
          .utilColors()
          .filter(color => game.getZoneByPlayer(player, color).splay === 'right')
          .filter(color => !othersSplayedColors.includes(color))
          .length
      }
    }
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
