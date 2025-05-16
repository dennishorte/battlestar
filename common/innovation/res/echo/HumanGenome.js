const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Human Genome`  // Card names are unique in Innovation
  this.name = `Human Genome`
  this.color = `blue`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `ssah`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may draw and score a card of any value. Take a bottom card from your board into your hand. If the values of all the cards in your hand match the values of all the card in your score pile, exactly, you win.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const drawAndScore = game.aYesNo(player, 'Draw and score a card of any value?')
      if (drawAndScore) {
        const age = game.aChooseAge(player)
        game.aDrawAndScore(player, age)
      }

      const choices = game
        .utilColors()
        .map(color => game.getBottomCard(player, color))
        .filter(card => card !== undefined)
      game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(player, 'hand'), {
        title: 'Choose a bottom card to transfer to your hand',
      })

      const scoreValues = game
        .getCardsByZone(player, 'score')
        .map(card => card.getAge())
        .sort()
      const handValues = game
        .getCardsByZone(player, 'hand')
        .map(card => card.getAge())
        .sort()

      if (scoreValues.join('') === handValues.join('')) {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }
      else {
        game.log.add({
          template: 'Score values do not match hand values.'
        })
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
