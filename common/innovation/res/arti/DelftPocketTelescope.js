const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Delft Pocket Telescope`  // Card names are unique in Innovation
  this.name = `Delft Pocket Telescope`
  this.color = `blue`
  this.age = 4
  this.expansion = `arti`
  this.biscuits = `fhss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal and return a card from your score pile. If you do, draw a {5} and a {6}, then reveal one of the drawn cards that has a symbol in common with the returned card. If you cannot, return the drawn cards and repeat the effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        const card = game.actions.chooseCard(player, game.getCardsByZone(player, 'score'))

        // Does nothing if player can't return a card from score.
        if (!card) {
          break
        }

        game.mReveal(player, card)
        const returned = game.aReturn(player, card)

        // If some karma prevents them from returning it, no effect.
        if (!returned) {
          game.log.add({ template: 'Card was not returned' })
          break
        }

        // Draw the 5 and 6
        const five = game.aDraw(player, { age: game.getEffectAge(this, 5) })
        const six = game.aDraw(player, { age: game.getEffectAge(this, 6) })

        // Check the biscuits
        const source = game.getBiscuitsByCard(card, 'top')
        const choices = []
        for (const card of [five, six]) {
          const biscuits = game.getBiscuitsByCard(card, 'top')
          for (const b of Object.keys(biscuits)) {
            if (source[b] > 0 && biscuits[b] > 0) {
              choices.push(card)
              break
            }
          }
        }

        // The player can choose which card to reveal if both share a biscuit.
        if (choices.length > 0) {
          const card = game.actions.chooseCard(player, choices)
          game.mReveal(player, card)
          break
        }
        else {
          game.log.add({ template: 'Neither card has a biscuit matching the returned card' })
          game.aReturn(player, five)
          game.aReturn(player, six)
        }
      }
    }
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
