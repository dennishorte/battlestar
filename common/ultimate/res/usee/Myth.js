const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Myth`  // Card names are unique in Innovation
  this.name = `Myth`
  this.color = `purple`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `hkkk` 
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have two cards of the same color in your hand, tuck them both. If you do, splay left that color, and draw and safeguard a card of value equal to the value of your bottom card of that color.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const hand = game.getZoneByPlayer(player, 'hand')
      const cardsByColor = hand.cards().reduce((map, card) => {
        map[card.color] = (map[card.color] || 0) + 1
        return map
      }, {})

      const colorWithTwo = Object.keys(cardsByColor).find(color => cardsByColor[color] >= 2)

      if (colorWithTwo) {
        const toTuck = hand.cards().filter(card => card.color === colorWithTwo).slice(0, 2)
        game.aTuckMany(player, toTuck)

        game.aSplay(player, colorWithTwo, 'left')
        
        const bottomCard = game.getCardsByZone(player, colorWithTwo).slice(-1)[0]
        const bottomValue = bottomCard ? bottomCard.age : 1

        const drawnCard = game.aDraw(player, { age: bottomValue })
        game.mLog({
          template: '{player} drew {card} and safeguarded it',
          args: { player, card: drawnCard }
        })
        game.mSafeguard(player, drawnCard)
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