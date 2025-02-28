const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Scouting`  // Card names are unique in Innovation
  this.name = `Scouting`
  this.color = `blue` 
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `lssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal two {8}. Return at least one of the drawn cards. If you return two, reveal the top card of the {10} deck. If the color of the revealed card matches the color of at least one of the returned cards, draw a {10}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cardsDrawn = []
      cardsDrawn.push(game.aDrawAndReveal(player, game.getEffectAge(this, 8)))
      cardsDrawn.push(game.aDrawAndReveal(player, game.getEffectAge(this, 8)))

      const returned = game.aChooseAndReturn(player, cardsDrawn, { min: 1, max: 2 })

      if (returned.length === 2) {
        const revealedCard = game.mReveal(game, game.aDraw(game, { age: 10 })[0])

        if (returned.some(card => card.color === revealedCard.color)) {
          game.mMoveCardTo(revealedCard, game.getZoneByPlayer(player, 'hand'))
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