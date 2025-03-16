const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Maze`  // Card names are unique in Innovation
  this.name = `Maze`
  this.color = `red`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `kkhk`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand for each card in my hand, you score a card of matching color. If you don't, and I have a card in my hand, exchange all cards in your hand with all cards in my score pile!`
//    `I demand you score a card from your hand of matching color for each card in my hand. If you don't, and I have a card in my hand, exchange all cards in your hand with all cards in my score pile!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const leaderHandCards = game.getCardsByZone(leader, 'hand')

      game.mLog({
        template: '{player} reveals their hand to show how many of which color they have',
        args: { player: leader }
      })
      game.aRevealMany(leader, leaderHandCards, { ordered: true })

      const playerHandCards = game.getCardsByZone(player, 'hand')

      // By the principle of "do as much as you can, the player starts scoring cards.
      const colorsToDiscard = leaderHandCards
        .map(c => c.color)
        .sort()

      while (colorsToDiscard.length > 0) {
        const colorString = makeColorString(colorsToDiscard)
        game.mLog({ template: 'remaining to discard are ' + colorString })

        const validCards = game
          .getCardsByZone(player, 'hand')
          .filter(c => colorsToDiscard.indexOf(c.color) >= 0)

        const scored = game.aChooseAndScore(player, validCards)[0]

        if (scored) {
          util.array.remove(colorsToDiscard, scored.color)
        }
        else {
          break
        }
      }

      if (colorsToDiscard.length > 0 && leaderHandCards.length > 0) {
        game.aExchangeZones(player, game.getZoneByPlayer(player, 'hand'), game.getZoneByPlayer(leader, 'score'))
      }
    },
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

function countItemsOrdered(arr) {
  const counts = {};
  const order = [];

  for (const item of arr) {
    if (counts[item] === undefined) {
      counts[item] = 0;
      order.push(item);
    }
    counts[item]++;
  }

  return order.map(item => [item, counts[item]]);
}

function makeColorString(remaining) {
  const counts = countItemsOrdered(remaining)
  return counts.map(([color, count]) => `${color}:${count}`).join(', ')
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
