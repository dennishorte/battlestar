const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `ATM`  // Card names are unique in Innovation
  this.name = `ATM`
  this.color = `yellow`
  this.age = 9
  this.expansion = `echo`
  this.biscuits = `ch&9`
  this.dogmaBiscuit = `c`
  this.echo = `Draw and score a card of any value.`
  this.karma = []
  this.dogma = [
    `I demand you transfer the highest top non-yellow card without a {c} from your board to my board!`,
    `You may splay your purple cards up.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const topCoins = game
        .getTopCards(player)
        .filter(card => card.color !== 'yellow')
        .filter(card => !card.checkHasBiscuit('c'))
        .sort((l, r) => r.getAge() - l.getAge())

      // In case there are no valid options.
      if (topCoins.length === 0) {
        game.mLog({ template: 'No valid cards' })
        return
      }

      const highest = util
        .array
        .takeWhile(topCoins, card => card.getAge() === topCoins[0].getAge())

      const card = game.aChooseCard(player, highest)
      if (card) {
        game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['purple'], 'up')
    }
  ]
  this.echoImpl = (game, player) => {
    const age = game.aChooseAge(player)
    game.aDrawAndScore(player, age)
  }
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
