const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Stamp Act`  // Card names are unique in Innovation
  this.name = `Stamp Act`
  this.color = `yellow`
  this.age = 6
  this.expansion = `arti`
  this.biscuits = `hcss`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer a card of value equal to the top yellow card on your board from your score pile to mine! If you do, return a card from your score pile of value equal to the top green card on your board!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const topYellow = game.getTopCard(player, 'yellow')
      if (topYellow) {
        const choices = game
          .getCardsByZone(player, 'score')
          .filter(card => card.getAge() === topYellow.getAge())
        const transferred =
          game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(leader, 'score'))

        if (transferred && transferred.length > 0) {
          const topGreen = game.getTopCard(player, 'green')
          if (topGreen) {
            const greenChoices = game
              .getCardsByZone(player, 'score')
              .filter(card => card.getAge() === topGreen.getAge())
            game.aChooseAndReturn(player, greenChoices)
          }
        }
        else {
          game.mLog({ template: 'No card was transferred' })
        }
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
