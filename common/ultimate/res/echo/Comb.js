const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Comb`  // Card names are unique in Innovation
  this.name = `Comb`
  this.color = `green`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `kklh`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a color, then draw and reveal five {1}s. Return the drawn cards that do not match the chosen color. If Comb was foreseen, return all cards of the chosen color from all boards.`
  ]

  this.dogmaImpl = [
    (game, player, { foreseen, self }) => {
      const color = game.aChoose(player, game.utilColors(), { title: 'Choose a Color' })[0]
      const cards = [
        game.aDrawAndReveal(player, game.getEffectAge(this, 1)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 1)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 1)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 1)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 1)),
      ].filter(card => card !== undefined)

      const others = cards.filter(card => card.color !== color)
      game.aReturnMany(player, others)

      if (foreseen) {
        game.mLogWasForeseen(self)

        const toReturn = game
          .getPlayerAll()
          .flatMap(p => game.getCardsByZone(p, color))

        game.aReturnMany(player, toReturn)
      }
    }
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
