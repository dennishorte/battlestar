const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Bioengineering`  // Card names are unique in Innovation
  this.name = `Bioengineering`
  this.color = `blue`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `siih`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Score a top card with a {l} on any player's board.`,
    `If any player has fewer than two {l} on their board, the single player with the most {l} on their board wins.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .players.all()
        .flatMap(p => game.getTopCards(p))
        .filter(card => card !== undefined)
        .filter(card => card.biscuits.includes('l'))

      game.aChooseAndScore(player, choices)
    },

    (game) => {
      const biscuits = Object
        .entries(game.getBiscuits())
        .map(([player, biscuits]) => ({ player, leafs: biscuits.l }))
        .sort((l, r) => r.leafs - l.leafs)

      const conditionMet = (
        biscuits[biscuits.length - 1].leafs < 2
        && biscuits[0].leafs > biscuits[1].leafs
      )

      if (conditionMet) {
        throw new GameOverEvent({
          player: game.players.byName(biscuits[0].player),
          reason: 'Bioengineering',
        })
      }
      else if (biscuits[0].leafs === biscuits[1].leafs) {
        game.log.add({ template: 'there is a tie for fewest leafs' })
      }
      else {
        game.log.addNoEffect()
      }
    },
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
