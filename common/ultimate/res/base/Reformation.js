const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Reformation`  // Card names are unique in Innovation
  this.name = `Reformation`
  this.color = `purple`
  this.age = 4
  this.expansion = `base`
  this.biscuits = `llhl`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay your yellow or purple cards right.`,
    `You may tuck a card from your hand for every splayed color on your board.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aChooseAndSplay(player, ['yellow', 'purple'], 'right')
    },
    (game, player) => {
      const count = game
        .getSplayedZones(player)
        .length

      if (count === 0) {
        game.mLog({ template: 'no splayed colors' })
        return
      }

      const proceed = game.requestInputSingle({
        actor: player.name,
        title: `Tuck ${count} cards from your hand?`,
        choices: ['yes', 'no']
      })[0]

      if (proceed === 'no') {
        game.mLog({
          template: '{player} does nothing',
          args: { player }
        })
        return
      }

      const choices = game
        .getZoneByPlayer(player, 'hand')
        .cards()
        .map(c => c.id)
      game.aChooseAndTuck(player, choices, { count })
    }
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
