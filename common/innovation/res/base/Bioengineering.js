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
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Transfer a top card with a {l} from any opponent's board to your score pile.`,
    `If any player has fewer than three {l} on their board, the single player with the most {l} on their board wins.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getPlayerOpponents(player)
        .flatMap(opp => game.getTopCards(opp))
        .filter(card => card !== undefined)
        .filter(card => card.biscuits.includes('l'))
      const target = game.getZoneByPlayer(player, 'score')

      game.aChooseAndTransfer(player, choices, target)
    },

    (game) => {
      const biscuits = Object
        .entries(game.getBiscuits())
        .map(([player, biscuits]) => ({ player, leafs: biscuits.l }))
        .sort((l, r) => r.leafs - l.leafs)

      const conditionMet = (
        biscuits[biscuits.length - 1].leafs < 3
        && biscuits[0].leafs > biscuits[1].leafs
      )

      if (conditionMet) {
        throw new GameOverEvent({
          player: game.getPlayerByName(biscuits[0].player),
          reason: 'Bioengineering',
        })
      }
      else if (biscuits[0].leafs === biscuits[1].leafs) {
        game.mLog({ template: 'there is a tie for fewest leafs' })
      }
      else {
        game.mLogNoEffect()
      }
    },
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
