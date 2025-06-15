const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Barometer`  // Card names are unique in Innovation
  this.name = `Barometer`
  this.color = `yellow`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `l&lh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Transfer a {5} from your forecast to your hand.`
  this.karma = []
  this.dogma = [
    `Draw and foreshadow a card of value two higher than a bonus on any board.`,
    `You may return all the cards in your forecast. If any were blue, claim the Destiny achievement.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const bonuses = game
        .players.all()
        .flatMap(player => game.getBonuses(player))
        .map(bonus => bonus + 2)
        .sort((l, r) => l - r)
      const distinct = util.array.distinct(bonuses)
      const age = game.aChooseAge(player, distinct)
      if (age) {
        game.aDrawAndForeshadow(player, age)
      }
    },

    (game, player) => {
      const returnAll = game.actions.chooseYesNo(player, 'Return all card from your forecast?')
      if (returnAll) {
        const returned = game.aReturnMany(player, game.getCardsByZone(player, 'forecast'))
        if (returned && returned.some(card => card.color === 'blue')) {
          game.aClaimAchievement(player, { name: 'Destiny' })
        }
      }
    },
  ]
  this.echoImpl = (game, player) => {
    const choices = game
      .getCardsByZone(player, 'forecast')
      .filter(card => card.getAge() === 5)
    game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(player, 'hand'))
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
