const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Bell`  // Card names are unique in Innovation
  this.name = `Bell`
  this.color = `purple`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `kmk&`
  this.dogmaBiscuit = `k`
  this.echo = `You may score a card from your hand.`
  this.karma = []
  this.dogma = [
    `Draw and foreshadow a {1} and a {2}.`,
    `If Bell was foreseen, return all cards from all hands.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDrawAndForeshadow(player, game.getEffectAge(this, 1))
      game.aDrawAndForeshadow(player, game.getEffectAge(this, 2))
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        const cards = game.getPlayerAll().flatMap(p => game.getCardsByZone(p, 'hand'))

        game.mLog({ template: 'I do not have a good way to hide only the cards in other player hands, so the game just automatically returns them all.' })
        game.aReturnMany(player, cards, { ordered: true })
      }
      else {
        game.mLogWasForeseen(self)
      }
    },
  ]
  this.echoImpl = (game, player) => {
    game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'), { min: 0, max: 1 })
  }
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
