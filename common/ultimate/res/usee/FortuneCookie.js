const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Fortune Cookie`  // Card names are unique in Innovation
  this.name = `Fortune Cookie`
  this.color = `purple`
  this.age = 7
  this.expansion = `usee`
  this.biscuits = `hllc`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have exactly seven of any icon on your board, draw and score a {7}; exactly eight, splay your green or purple cards right and draw an {9}; exactly nine, draw a {7}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const biscuits = game.getBiscuits()
      const playerBiscuits = biscuits[player.name]
      
      const exactlySevenIcon = Object.entries(playerBiscuits).find(([icon, count]) => count === 7)
      const exactlyEightIcon = Object.entries(playerBiscuits).find(([icon, count]) => count === 8)  
      const exactlyNineIcon = Object.entries(playerBiscuits).find(([icon, count]) => count === 9)
      
      if (exactlySevenIcon) {
        game.aDrawAndScore(player, game.getEffectAge(this, 7))
      }
      
      if (exactlyEightIcon) {
        const choices = ['green', 'purple'].filter(color => game.getZoneByPlayer(player, color).splay !== 'right')
        if (choices.length > 0) {
          const color = game.aChoose(player, choices, { title: 'Choose a color to splay right' })[0]
          game.aSplay(player, color, 'right')
          game.aDraw(player, { age: game.getEffectAge(this, 9) })
        }
        else {
          game.mLogNoEffect() 
        }
      }
      
      if (exactlyNineIcon) {
        game.aDraw(player, { age: game.getEffectAge(this, 7) })
      }
      
      if (!exactlySevenIcon && !exactlyEightIcon && !exactlyNineIcon) {
        game.mLogNoEffect()
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