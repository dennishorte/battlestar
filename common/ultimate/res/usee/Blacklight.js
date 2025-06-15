const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Blacklight`
  this.name = `Blacklight`
  this.color = `blue`
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `hfff`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose to either unsplay one color of your cards, or splay up an unsplayed color on your board and draw a {9}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const unsplayChoices = ['yellow', 'red', 'blue', 'green', 'purple']
        .filter(color => game.getZoneByPlayer(player, color).splay !== 'none')

      const splayChoices = ['yellow', 'red', 'blue', 'green', 'purple']
        .filter(color => game.getZoneByPlayer(player, color).splay === 'none')

      const choices = []
      if (unsplayChoices.length > 0) {
        choices.push({
          title: 'Unsplay',
          choices: unsplayChoices,
          min: 0,
          max: 1,
        })
      }
      if (splayChoices.length > 0) {
        choices.push({
          title: 'Splay up and draw',
          choices: splayChoices,
          min: 0,
          max: 1,
        })
      }

      const choice = game.actions.choose(player, choices)[0]

      if (choice.title === 'Unsplay') {
        game.aUnsplay(player, choice.selection[0])
      }
      else if (choice.title === 'Splay up and draw') {
        game.aSplay(player, choice.selection[0], 'up')
        game.aDraw(player, { age: game.getEffectAge(this, 9) })
      }
      else {
        throw new Error('Invalid option: ' + choice)
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
