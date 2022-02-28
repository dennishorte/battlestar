const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Agriculture`  // Card names are unique in Innovation
  this.name = `Agriculture`
  this.color = `yellow`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `hlll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return a card from your hand. If you do, draw and score a card of value one higher than the card you returned.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cardsInHand = game.getZoneByPlayer(player, 'hand').cards().map(c => c.name)
      const returned = game.requestInputSingle({
        actor: player.name,
        title: 'Choose a Card',
        choices: cardsInHand,
        min: 0,
        max: 1,
      })

      if (returned.length > 0) {
        const card = game.getCardByName(returned[0])
        const returnedCard = game.aReturn(player, card)
        if (returnedCard) {
          game.aDrawAndScore(player, card.age + 1)
        }
      }
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
