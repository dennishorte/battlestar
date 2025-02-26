const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tuning Fork`  // Card names are unique in Innovation
  this.name = `Tuning Fork`
  this.color = `purple`
  this.age = 5
  this.expansion = `echo`
  this.biscuits = `&ssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Look at the top card of any deck, then place it back on top.`
  this.karma = []
  this.dogma = [
    `Return a card from your hand. If you do, draw and reveal a card of the same value, and meld it if it is of higher value than the top card of the same color on your board. Otherwise, return it. You may repeat this dogma effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        const returned = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'))[0]
        if (returned) {
          const revealed = game.aDrawAndReveal(player, returned.getAge())
          if (revealed) {
            const top = game.getTopCard(player, revealed.color)
            if (!top || revealed.getAge() > top.getAge()) {
              game.aMeld(player, revealed)
            }
            else {
              game.aReturn(player, revealed)
            }
          }
        }
        else {
          break
        }

        if (game.getCardsByZone(player, 'hand').length === 0) {
          break
        }

        const repeat = game.aYesNo(player, 'Repeat this dogma effect?')
        if (repeat) {
          continue
        }
        else {
          break
        }
      }
    }
  ]
  this.echoImpl = (game, player) => {
    const exp = game.aChoose(player, game.getExpansionList(), { title: 'Choose the type of deck' })[0]
    const ages = [1,2,3,4,5,6,7,8,9,10]
      .filter(age => game.getZoneByDeck(exp, age).cards().length > 0)
    const age = game.aChooseAge(player, ages)

    const card = game.mDraw(player, exp, age)
    game.mMoveCardToTop(card, game.getZoneById(card.home), { player })
  }
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
