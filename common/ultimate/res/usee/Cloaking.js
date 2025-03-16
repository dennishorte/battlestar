const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Cloaking`
  this.name = `Cloaking`
  this.color = `red`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `hsfs`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer one of your claimed standard achievements to my safe!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game
        .getCardsByZone(player, 'achievements')
        .filter(card => card.checkIsStandardAchievement())

      const card = game.aChooseCards(player, choices, {
        title: 'Choose a standard achievement to transfer',
        hidden: true
      })[0]

      if (card) {
        game.aTransfer(player, card, game.getZoneByPlayer(leader, 'safe'))
      }
    },
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
