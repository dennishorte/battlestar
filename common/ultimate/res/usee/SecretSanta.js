const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Secret Santa`  // Card names are unique in Innovation
  this.name = `Secret Santa`
  this.color = `red`
  this.age = 10
  this.expansion = `usee`
  this.biscuits = `sshp`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you meld a card from my score pile!`,
    `Draw and score three {0}.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game.getZoneByPlayer(leader, 'score').cards()
      const card = game.aChooseCards(player, choices, { hidden: true })[0]
      if (card) {
        game.aMeld(player, card)
      }
    },
    (game, player) => {
      game.aDrawAndScore(player, game.getEffectAge(this, 10))
      game.aDrawAndScore(player, game.getEffectAge(this, 10))
      game.aDrawAndScore(player, game.getEffectAge(this, 10))
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
