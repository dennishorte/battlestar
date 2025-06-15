const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Chopsticks`  // Card names are unique in Innovation
  this.name = `Chopsticks`
  this.color = `yellow`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `hll&`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Draw a {1}.`
  this.karma = []
  this.dogma = [
    `If the {1} deck has at least one card, you may transfer its bottom card to the available achievements.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const age = game.getEffectAge(this, 1)
      const deck = game.getZoneByDeck('base', age).cards()
      if (deck.length > 0) {
        const addAchievement = game.actions.chooseYesNo(player, `Transfer the bottom card of the {${age}} deck to the available achievements?`)
        if (addAchievement) {
          const card = deck[deck.length - 1]
          game.aTransfer(player, card, game.getZoneById('achievements'))
        }
      }
      else {
        game.log.addNoEffect()
      }
    }
  ]
  this.echoImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 1) })
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
