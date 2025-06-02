const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Velcro Shoes`  // Card names are unique in Innovation
  this.name = `Velcro Shoes`
  this.color = `red`
  this.age = 9
  this.expansion = `arti`
  this.biscuits = `ffih`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer a {9} from your hand to my hand! If you do not, transfer a {9} from your score pile to my score pile! If you do neither, I win!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const hand = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.getAge() === 9)
      const transferred = game.aChooseAndTransfer(player, hand, game.getZoneByPlayer(leader, 'hand'))

      if (transferred && transferred.length > 0) {
        game.log.add({ template: 'A card was transferred' })
        return
      }

      const score = game
        .getCardsByZone(player, 'score')
        .filter(card => card.getAge() === 9)
      const st = game.aChooseAndTransfer(player, score, game.getZoneByPlayer(leader, 'score'))
      if (st && st.length > 0) {
        game.log.add({ template: 'A card was transferred' })
        return
      }

      throw new GameOverEvent({
        player: leader,
        reason: this.name
      })
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
