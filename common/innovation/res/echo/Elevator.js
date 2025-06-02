const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Elevator`  // Card names are unique in Innovation
  this.name = `Elevator`
  this.color = `yellow`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `7&ih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = `Score your top or bottom green card.`
  this.karma = []
  this.dogma = [
    `Choose a value present in your score pile. Choose to transfer all cards of the chosen value from either all other players' hands or all their score piles to your score pile.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getCardsByZone(player, 'score')
        .map(card => card.getAge())
      const distinct = util.array.distinct(choices).sort()
      const age = game.aChooseAge(player, distinct)
      if (age) {
        game.log.add({
          template: '{player} chooses {age}',
          args: { player, age }
        })
        const location = game.aChoose(player, ['from scores', 'from hands'])[0]
        game.log.add({
          template: '{player} chooses {location}',
          args: { player, location }
        })

        const otherPlayers = game
          .players.all()
          .filter(other => other !== player)
        let cards
        if (location === 'from scores') {
          cards = otherPlayers
            .flatMap(player => game.getCardsByZone(player, 'score'))
        }
        else {
          cards = otherPlayers
            .flatMap(player => game.getCardsByZone(player, 'hand'))
        }

        cards = cards.filter(card => card.getAge() === age)

        game.aTransferMany(player, cards, game.getZoneByPlayer(player, 'score'))
      }
    }
  ]
  this.echoImpl = (game, player) => {
    const green = game.getCardsByZone(player, 'green')
    if (green.length === 0) {
      game.log.addNoEffect()
    }
    else if (green.length === 1) {
      game.aScore(player, green[0])
    }
    else {
      const topOrBottom = game.aChoose(player, ['score top green', 'score bottom green'])[0]
      if (topOrBottom === 'score top green') {
        game.aScore(player, green[0])
      }
      else {
        game.aScore(player, green[green.length - 1])
      }
    }
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
