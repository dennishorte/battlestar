const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Exxon Valdez`  // Card names are unique in Innovation
  this.name = `Exxon Valdez`
  this.color = `red`
  this.age = 10
  this.expansion = `arti`
  this.biscuits = `fhff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to remove all cards from your hand, score pile, board, and achievements from the game. You lose! If there is only one player remaining in the game, that player wins!`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const toRemove = [
        game.getCardsByZone(player, 'hand'),
        game.getCardsByZone(player, 'score'),
        game.getCardsByZone(player, 'red'),
        game.getCardsByZone(player, 'yellow'),
        game.getCardsByZone(player, 'green'),
        game.getCardsByZone(player, 'blue'),
        game.getCardsByZone(player, 'purple'),
        game.getCardsByZone(player, 'achievements'),
      ].flat()

      game.aRemoveMany(player, toRemove)

      game.log.add({
        template: '{player} exiles all of their cards',
        args: { player }
      })

      game.aYouLose(player)

      const livingPlayers = game.getPlayerAll().filter(player => !player.dead)

      if (livingPlayers.length === 1) {
        throw new GameOverEvent({
          player: livingPlayers[0],
          reason: this.name,
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
