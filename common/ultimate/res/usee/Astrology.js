const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Astrology`  // Card names are unique in Innovation
  this.name = `Astrology`
  this.color = `blue`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `cchl`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay left the color of which you have the most cards on your board.`,
    `Draw and meld a card of value equal to the number of visible purple cards on your board. If the melded card has no [s], tuck it.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const mostCardsColor = game.utilColors().reduce((mostColor, color) => {
        const currentCount = game.getCardsByZone(player, color).length
        const mostCount = game.getCardsByZone(player, mostColor).length
        return currentCount > mostCount ? color : mostColor
      }, game.utilColors()[0])
      
      game.aChooseAndSplay(player, [mostCardsColor], 'left')
    },
    (game, player) => {
      const numPurpleCards = game
        .getTopCards(player)
        .filter(card => card.color === 'purple')
        .length

      const card = game.aDrawAndMeld(player, numPurpleCards)
      
      if (card && !card.checkHasBiscuit('s')) {
        game.mLog({
          template: '{player} tucks {card}',
          args: { player, card }
        })
        game.mMoveCardTo(card, game.getZoneByPlayer(player, card.color), { tuck: true })
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