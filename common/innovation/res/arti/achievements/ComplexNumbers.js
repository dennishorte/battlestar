const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = `Complex Numbers`  // Card names are unique in Innovation
  this.name = `Complex Numbers`
  this.shortName = 'cplx'
  this.color = `blue`
  this.age = 4
  this.expansion = `arti`
  this.biscuits = `fhss`
  this.dogmaBiscuit = `s`
  this.isSpecialAchievement = true
  this.isRelic = true
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may reveal a card from your hand having exactly the same icons, in type and number, as a top card on your board. If you do, claim an achievement of matching value, ignoring eligibility.`
  ]
  this.relicExpansion = 'base'

  this.dogmaImpl = [
    (game, player) => {
      const topCardsSortedBiscuits = game
        .getTopCards(player)
        .map(card => card.biscuits.split('').sort().join(''))
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => {
          const sortedBiscuits = card.biscuits.split('').sort().join('')
          return topCardsSortedBiscuits.some(top => top === sortedBiscuits)
        })
      const revealed = game.aChooseAndReveal(player, choices, { min: 0, max: 1 })
      if (revealed && revealed.length > 0) {
        const achs = game
          .getAvailableAchievementsRaw(player)
          .filter(ach => ach.age === revealed[0].getAge())
        game.aChooseAndAchieve(player, achs)
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
