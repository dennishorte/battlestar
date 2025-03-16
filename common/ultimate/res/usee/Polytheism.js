const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Polytheism`  // Card names are unique in Innovation
  this.name = `Polytheism`
  this.color = `purple`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `hssk`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld a card from your hand with no biscuit on a card already melded by you during this action due to Polytheism. If you do, repeat this effect.`,
    `Draw and tuck a {1}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const meldedBiscuits = game.utilEmptyBiscuits()

      while (true) {
        const hand = game.getCardsByZone(player, 'hand')
        const choices = hand.filter(c => ![...c.biscuits].some(b => b in meldedBiscuits && meldedBiscuits[b] > 0))
        const melded = game.aChooseAndMeld(player, choices, { count: 1 })

        if (melded.length > 0) {
          for (const b of melded[0].biscuits) {
            if (b in meldedBiscuits) {
              meldedBiscuits[b] += 1
            }
          }
          continue
        }
        else {
          break
        }
      }
    },
    (game, player) => {
      game.aDrawAndTuck(player, game.getEffectAge(this, 1))
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
