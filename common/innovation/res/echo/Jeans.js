const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Jeans`  // Card names are unique in Innovation
  this.name = `Jeans`
  this.color = `green`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `&lh8`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Draw two {9}. Return one, foreshadow the other.`
  this.karma = []
  this.dogma = [
    `Choose two different values less than {7}. Draw and reveal a card of each value. Meld one, and return the other.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const age1 = game.aChooseAge(player, [1,2,3,4,5,6], { title: 'Choose age to draw first' })
      const age2 = game.aChooseAge(
        player,
        [1,2,3,4,5,6].filter(x => x !== age1),
        { title: 'Choose age to draw second' }
      )
      const cards = [
        game.aDrawAndReveal(player, age1),
        game.aDrawAndReveal(player, age2),
      ]

      const melded = game.aChooseAndMeld(player, cards)
      if (melded && melded.length > 0) {
        cards.splice(cards.indexOf(melded[0]), 1)
      }

      if (cards.length > 0) {
        game.aReturn(player, cards[0])
      }
    }
  ]
  this.echoImpl = (game, player) => {
    const cards = [
      game.aDraw(player, { age: game.getEffectAge(this, 9) }),
      game.aDraw(player, { age: game.getEffectAge(this, 9) }),
    ].filter(card => card !== undefined)

    const toReturn = game.actions.chooseCard(player, cards, { title: 'Choose a card to return' })

    if (toReturn) {
      game.aReturn(player, toReturn)
      cards.splice(cards.indexOf(toReturn), 1)
    }

    if (cards.length > 0) {
      game.aForeshadow(player, cards[0])
    }
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
