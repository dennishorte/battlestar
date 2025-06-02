const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Lurgan Canoe`  // Card names are unique in Innovation
  this.name = `Lurgan Canoe`
  this.color = `yellow`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `hccc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld a card from your hand. Score all other cards of the same color from your board. If you scored at least one card, repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        const melded = game.aChooseAndMeld(player, game.getCardsByZone(player, 'hand'))
        if (melded && melded.length > 0) {
          const card = melded[0]
          const toScore = game
            .getCardsByZone(player, card.color)
            .filter(other => other !== card)
          const scored = game.aScoreMany(player, toScore)
          if (scored && scored.length > 0) {
            game.log.add({ template: 'Repeat this effect.' })
            continue
          }
          else {
            game.log.add({ template: 'No cards were scored.' })
            break
          }
        }
        else {
          game.log.add({ template: 'No cards were scored.' })
          break
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
