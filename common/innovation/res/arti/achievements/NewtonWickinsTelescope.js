const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = `Newton-Wickins Telescope`  // Card names are unique in Innovation
  this.name = `Newton-Wickins Telescope`
  this.shortName = 'tele'
  this.color = `purple`
  this.age = 5
  this.expansion = `arti`
  this.biscuits = `fsfh`
  this.dogmaBiscuit = `f`
  this.isSpecialAchievement = true
  this.isRelic = true
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return any number of cards from your score pile. If you do, draw and meld a card of value equal to the number of cards returned. If the melded card has a {i}, return it.`
  ]
  this.relicExpansion = 'arti'

  this.dogmaImpl = [
    (game, player) => {
      const returned = game.aChooseAndReturn(player, game.getCardsByZone(player, 'score'), { min: 0 })
      if (returned && returned.length > 0) {
        const card = game.aDrawAndMeld(player, returned.length)
        if (card.checkHasBiscuit('i')) {
          game.aReturn(player, card)
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
