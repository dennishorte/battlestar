const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Blacklight`  
  this.name = `Blacklight`
  this.color = `blue`
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `hfff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
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

      const choice = game.aChoose(player, ['Unsplay', 'Splay Up'], { title: 'Choose an action:' })[0]

      if (choice === 'Unsplay') {
        const color = game.aChoose(player, unsplayChoices, { title: 'Choose a color to unsplay:' })[0]
        game.aUnsplay(player, color)
      } 
      else if (choice === 'Splay Up') {
        const color = game.aChoose(player, splayChoices, { title: 'Choose a color to splay up:' })[0]
        game.aSplay(player, color, 'up')
        game.aDraw(player, { age: game.getEffectAge(this, 9) })
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