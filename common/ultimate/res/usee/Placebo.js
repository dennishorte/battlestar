const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Placebo`  // Card names are unique in Innovation
  this.name = `Placebo`
  this.color = `blue`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `ssfh`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a top card on your board, then you may repeat as many times as you want with the same color. Draw a {7} for each card you return. If you return exactly one {7}, draw an {8}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const firstCard = game.aChooseAndReturn(player, game.getTopCards(player))[0]

      if (!firstCard) {
        return
      }

      const returnedCards = [firstCard]
      const color = firstCard.color

      while (game.getTopCard(player, color)) {
        const card = game.aChooseAndReturn(player, [game.getTopCard(player, color)], { min: 0, max: 1 })[0]

        if (!card) {
          break
        }

        returnedCards.push(card)
      }

      returnedCards.forEach(() => {
        game.aDraw(player, { age: game.getEffectAge(this, 7) })
      })

      const numSevensReturned = returnedCards
        .reduce((acc, c) => c.getAge() === 7 ? acc + 1 : acc, 0)

      if (numSevensReturned === 1) {
        game.log.add({
          template: '{player} returned exactly one card of value 7',
          args: { player }
        })
        game.aDraw(player, { age: game.getEffectAge(this, 8) })
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
