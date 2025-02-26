const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Charter of Liberties`  // Card names are unique in Innovation
  this.name = `Charter of Liberties`
  this.color = `blue`
  this.age = 3
  this.expansion = `arti`
  this.biscuits = `sshk`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Tuck a card from your hand. If you do, splay left its color, then choose a (different) splayed color on any player's board. Execute all of that color's top card's non-demand dogma effects, without sharing.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'))

      if (cards && cards.length > 0) {
        const card = cards[0]
        game.aSplay(player, card.color, 'left')

        const choices = game
          .getPlayerAll()
          .flatMap(player => game
            .utilColors()
            .map(color => game.getZoneByPlayer(player, color))
            .filter(zone => zone.splay !== 'none')
          )
          .filter(zone => !zone.cards().includes(card))
          .map(zone => zone.cards()[0])
        const choice = game.aChooseCard(player, choices)
        if (choice) {
          game.aCardEffects(player, choice, 'dogma')
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
