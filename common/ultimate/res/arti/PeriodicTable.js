const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Periodic Table`  // Card names are unique in Innovation
  this.name = `Periodic Table`
  this.color = `blue`
  this.age = 7
  this.expansion = `arti`
  this.biscuits = `shss`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose two top cards on your board of the same value. If you do, draw a card of value one higher and meld it. If it melded over one of the chosen cards, repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        const byAge = {}
        for (const card of game.getTopCards(player)) {
          if (!Object.hasOwn(byAge, card.age)) {
            byAge[card.age] = [card]
          }
          else {
            byAge[card.age].push(card)
          }
        }

        const choices = Object
          .values(byAge)
          .filter(cards => cards.length > 1)
          .flatMap(cards => util.array.pairs(cards))
          .map(([x, y]) => `${x.name}, ${y.name}`)

        const selections = game.aChoose(player, choices, { title: 'Choose two cards' })
        if (selections && selections.length > 0) {
          const cards = selections[0]
            .split(', ')
            .map(name => game.getCardByName(name))

          const melded = game.aDrawAndMeld(player, cards[0].age + 1)

          if (melded && (melded.color === cards[0].color || melded.color === cards[1].color)) {
            continue
          }
          else {
            break
          }
        }
        else {
          break
        }
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
