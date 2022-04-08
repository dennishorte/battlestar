const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Twister`  // Card names are unique in Innovation
  this.name = `Twister`
  this.color = `purple`
  this.age = 10
  this.expansion = `arti`
  this.biscuits = `hffi`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to reveal your score pile! For each color, meld a card of that color from your score pile.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game
        .getCardsByZone(player, 'score')
        .forEach(card => game.mReveal(player, card))

      const meldedColors = []
      while (true) {
        const choices = game
          .getCardsByZone(player, 'score')
          .filter(card => !meldedColors.includes(card.color))

        if (choices.length === 0) {
          game.mLog({ template: 'No more colors to meld' })
          break
        }

        const card = game.aChooseCard(player, choices, { title: 'Choose a card to meld' })
        meldedColors.push(card.color)
        game.aMeld(player, card)
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
