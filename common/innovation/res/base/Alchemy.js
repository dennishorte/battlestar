const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Alchemy`  // Card names are unique in Innovation
  this.name = `Alchemy`
  this.color = `blue`
  this.age = 3
  this.expansion = `base`
  this.biscuits = `hlkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {4} for every three {k} on your board. If ay of the drawn cards are red, return the cards drawn and all card in your hand. Otherwise, keep them.`,
    `Meld a card from your hand, then score a card from your hand.`
  ]

  this.dogmaImpl = [
    (game, player, { biscuits }) => {
      const count = Math.floor(biscuits[player.name].k / 3)
      let red = false

      for (let i = 0; i < count; i++) {
        const card = game.aDrawAndReveal(player, game.getEffectAge(this, 4))
        red = red || card.color === 'red'
      }

      if (red) {
        game.mLog({
          template: '{player} drew a red card. Returning all cards in hand.',
          args: { player }
        })
        game.aReturnMany(player, game.getZoneByPlayer(player, 'hand').cards())
      }
    },
    (game, player) => {
      const hand = () => game
        .getZoneByPlayer(player, 'hand')
        .cards()
        .map(c => c.id)
      game.aChooseAndMeld(player, hand())
      game.aChooseAndScore(player, hand())
    },
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
