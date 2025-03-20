const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Perfume`  // Card names are unique in Innovation
  this.name = `Perfume`
  this.color = `blue`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `&k1h`
  this.dogmaBiscuit = `k`
  this.echo = `Draw and tuck a {1}. If it has {k}, repeat this effect.`
  this.karma = []
  this.dogma = [
    `I demand you transfer a top card of different value from any top card on my board from your board to mine! If you do, draw and meld a card of equal value!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const leaderAges = game
        .getTopCards(leader)
        .map(card => card.getAge())
      const choices = game
        .getTopCards(player)
        .filter(card => !leaderAges.includes(card.getAge()))
      const card = game.aChooseCard(player, choices, { title: 'Choose a card to transfer' })
      if (card) {
        const transferred = game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
        if (transferred) {
          game.aDrawAndMeld(player, card.getAge())
        }
      }
    }
  ]
  this.echoImpl = (game, player) => {
    while (true) {
      const card = game.aDrawAndTuck(player, game.getEffectAge(this, 1))
      if (!card.checkHasBiscuit('k')) {
        break
      }
    }
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
