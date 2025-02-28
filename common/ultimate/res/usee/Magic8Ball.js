const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Magic 8-Ball`  // Card names are unique in Innovation
  this.name = `Magic 8-Ball`
  this.color = `yellow` 
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `hlll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose whether you wish to draw two {9}, draw and score one {9}, or safeguard two available standard achievements. Draw and tuck an {8}. If it has {l}, do as you wish. If it is red or purple, repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choice = game.aChoose(player, [
        'Draw two 9',
        'Draw and score one 9', 
        'Safeguard two available standard achievements'
      ], { title: 'Magic 8-Ball Dogma' })

      switch (choice[0]) {
        case 'Draw two 9':
          game.aDraw(player, { age: game.getEffectAge(this, 9) })
          game.aDraw(player, { age: game.getEffectAge(this, 9) })
          break
        case 'Draw and score one 9':
          game.aDrawAndScore(player, game.getEffectAge(this, 9))
          break
        case 'Safeguard two available standard achievements':
          game.aSafeguardAchievements(player, 2, 'standard')
          break
      }
      
      let repeat = false
      do {
        const tuckedCard = game.aDrawAndTuck(player, game.getEffectAge(this, 8))
        if (tuckedCard.checkHasBiscuit('l')) {
          game.aCardEffects(player, tuckedCard, 'dogma', { leader: player })
        } 
        repeat = tuckedCard.color === 'red' || tuckedCard.color === 'purple'
      } while (repeat)
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