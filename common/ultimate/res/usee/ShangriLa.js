const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Shangri-La`  // Card names are unique in Innovation
  this.name = `Shangri-La`
  this.color = `yellow`
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `hcll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and tuck an {8}. If it has {l}, score it. Otherwise, draw and meld an {8}. If it is an {l}, repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const executeEffect = () => {
        const tucked = game.aDrawAndTuck(player, game.getEffectAge(this, 8))
        if (tucked.checkHasBiscuit('l')) {
          game.aScore(player, tucked)
        } else {
          const melded = game.aDrawAndMeld(player, game.getEffectAge(this, 8))
          if (melded.checkHasBiscuit('l')) {
            executeEffect()
          }
        }
      }
      
      executeEffect()
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