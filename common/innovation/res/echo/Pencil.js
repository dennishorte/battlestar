const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pencil`  // Card names are unique in Innovation
  this.name = `Pencil`
  this.color = `yellow`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `h&s4`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a {5}.`
  this.karma = []
  this.dogma = [
    `You may return up to three cards from your hand. If you do, draw that many cards of value one higher than the highest card you returned. Foreshadow one of them, and return the rest of the drawn cards.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const returned = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'), {
        min: 0,
        max: 3
      })

      if (returned && returned.length > 0) {
        const age = game.utilHighestCards(returned)[0].getAge()
        const drawn = []
        for (let i = 0; i < returned.length; i++) {
          const card = game.aDraw(player, { age: age + 1 })
          if (card) {
            drawn.push(card)
          }
        }

        const card = game.aChooseCard(player, drawn, { title: 'Choose a card to foreshadow' })
        game.aForeshadow(player, card)
        game.aReturnMany(player, drawn.filter(other => other !== card))
      }
    }
  ]
  this.echoImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 5) })
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
