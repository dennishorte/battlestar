const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Escapism`  // Card names are unique in Innovation
  this.name = `Escapism`
  this.color = `purple`
  this.age = 11
  this.expansion = `base`
  this.biscuits = `pphp`
  this.dogmaBiscuit = `p`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal and junk a card in your hand. Return from your hand all cards of value equal to the value of the junked card. Draw three cards of that value. Self-execute the junked card.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const hand = game.getZoneByPlayer(player, 'hand').cards()
      if (hand.length === 0) {
        game.log.addNoEffect()
        return
      }

      const card = game.aChooseCard(player, hand)
      if (card) {
        game.mReveal(player, card)
        game.aJunk(player, card)

        const cardValue = card.getAge()
        game.log.add({
          template: '{player} will return all cards of value {value} from hand',
          args: { player, value: cardValue }
        })

        const toReturn = hand
          .filter(c => c.getAge() === cardValue)
          .filter(c => c.name !== card.name)
        game.aReturnMany(player, toReturn, { ordered: true })

        for (let i = 0; i < 3; i++) {
          game.aDraw(player, { age: cardValue })
        }

        game.aSelfExecute(player, card)
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
