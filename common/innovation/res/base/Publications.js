const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Publications`  // Card names are unique in Innovation
  this.name = `Publications`
  this.color = `blue`
  this.age = 7
  this.expansion = `base`
  this.biscuits = `hsis`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may rearrange the order of one color of cards on your board.`,
    `You may splay your yellow or blue cards up.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const colors = game
        .utilColors()
        .filter(color => game.getCardsByZone(player, color).length > 0)

      const color = game.actions.choose(player, colors, 'Choose a Color')[0]
      game.log.add({
        template: '{player} choose {color}',
        args: { player, color }
      })

      const zone = game.getZoneByPlayer(player, color)
      let remaining = zone.cards()
      let position = 0
      while (true) {
        const posString = position === 0 ? 'top' : 'top+' + position
        const card = game.aChooseCard(
          player,
          remaining.concat(['auto']),
          { title: `Choose the card you want at ${posString} at the end of this action.` },
        )

        if (card === 'auto') {
          game.log.add({
            template: '{player} leaves the rest in their current order',
            args: { player }
          })
          break
        }

        game.mMoveByIndices(
          zone, zone.cards().indexOf(card),
          zone, position
        )

        game.log.add({
          template: `{player} moves {card} to ${posString}`,
          args: { player, card }
        })

        game.mActed(player)

        position += 1
        remaining = remaining.filter(other => other != card)
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['yellow', 'blue'], 'up')
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
