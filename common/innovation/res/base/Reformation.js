const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Reformation`  // Card names are unique in Innovation
  this.name = `Reformation`
  this.color = `purple`
  this.age = 4
  this.expansion = `base`
  this.biscuits = `llhl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may tuck a card from your hand for every two {l} on your board.`,
    `You may splay your yellow or purple cards right.`
  ]

  this.dogmaImpl = [
    (game, player, { biscuits }) => {
      const count = Math.floor(biscuits[player.name].l / 2)
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
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['yellow', 'purple'], 'right')
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
