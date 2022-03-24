const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Higgs Boson`  // Card names are unique in Innovation
  this.name = `Higgs Boson`
  this.color = `blue`
  this.age = 10
  this.expansion = `arti`
  this.biscuits = `sssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Transfer all cards on your board to your score pile.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const autoReturn = game.aYesNo(player, 'Auto return cards?')
      const scoreZone = game.getZoneByPlayer(player, 'score')

      if (autoReturn) {
        const cards = game
          .utilColors()
          .flatMap(color => game.getCardsByZone(player, color))

        game.aTransferMany(player, cards, scoreZone, { ordered: true })
      }
      else {
        while (true) {
          const choices = game.getTopCards(player)
          if (choices.length === 0) {
            break
          }
          else {
            const card = game.aChooseCard(player, choices)
            if (card) {
              game.aTransfer(player, card, scoreZone)
            }
            else {
              console.log({
                template: 'Unable to transfer card. Stopping.'
              })
              break
            }
          }
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
