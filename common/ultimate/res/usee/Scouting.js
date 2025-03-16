const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Scouting`  // Card names are unique in Innovation
  this.name = `Scouting`
  this.color = `blue`
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `lssh`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal two {9}. Return at least one of the drawn cards. If you return two, draw and reveal a {0}. If the color of the revealed card matches the color of at least one of the returned cards, keep it. Otherwise, put it back on top of its deck.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cardsDrawn = [
        game.aDrawAndReveal(player, game.getEffectAge(this, 9)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 9)),
      ].filter(x => x !== undefined)

      const returned = game.aChooseAndReturn(player, cardsDrawn, { min: 1, max: 2 })

      if (returned.length === 2) {
        const card = game.aDrawAndReveal(player, game.getEffectAge(this, 10))
        if (cardsDrawn.find(c => c.color === card.color)) {
          game.mLog({
            template: '{player} keeps the card',
            args: { player }
          })
        }
        else {
          game.mMoveCardToTop(card, game.getZoneByCardHome(card), { player })
        }
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
