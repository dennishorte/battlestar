const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Cyrus Cylinder`  // Card names are unique in Innovation
  this.name = `Cyrus Cylinder`
  this.color = `purple`
  this.age = 2
  this.expansion = `arti`
  this.biscuits = `hssk`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose any other top purple card on any player's board. Execute its non-demand dogma effects. Do not share them.`,
    `Splay left a color on any player's board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .players.all()
        .map(player => game.getTopCard(player, 'purple'))
        .filter(card => card !== undefined)
        .filter(card => card.name !== this.name)

      const card = game.aChooseCard(player, choices)
      if (card) {
        game.aCardEffects(player, card, 'dogma')
      }
    },

    (game, player) => {
      const splayChoices = game
        .players.all()
        .flatMap(player => game.utilColors().map(color => ({ player, color })))
        .map(x => `${x.player.name}-${x.color}`)

      const selections = game.actions.choose(player, splayChoices)
      if (selections && selections.length > 0) {
        const [playerName, color] = selections[0].split('-')
        const other = game.players.byName(playerName)
        game.aSplay(player, color, 'left', { owner: other })
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
