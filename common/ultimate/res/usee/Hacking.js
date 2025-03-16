const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hacking`  // Card names are unique in Innovation
  this.name = `Hacking`
  this.color = `blue`
  this.age = 10
  this.expansion = `usee`
  this.biscuits = `hiis`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer your two highest secrets to my safe! Transfer the two highest cards in your score pile to my score pile! Meld the two lowest cards from your score pile!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const secrets = game.aChooseHighest(player, game.getCardsByZone(player, 'safe'), 2, {
        title: 'Choose secrets to transfer',
      })
      game.aTransferMany(player, secrets, game.getZoneByPlayer(leader, 'safe'))

      const score = game.aChooseHighest(player, game.getCardsByZone(player, 'score'), 2, {
        title: 'Choose score to transfer',
      })
      game.aTransferMany(player, score, game.getZoneByPlayer(leader, 'score'))

      const toMeld = game.aChooseLowest(player, game.getCardsByZone(player, 'score'), 2, {
        title: 'Choose score to meld',
      })
      game.aMeldMany(player, toMeld)
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
