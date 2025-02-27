const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Astrogeology`  // Card names are unique in Innovation
  this.name = `Astrogeology`
  this.color = `red`
  this.age = 11
  this.expansion = `base`
  this.biscuits = `chii`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal an 11. Splay its color on your board aslant. If you do, return all but your top four cards of that color to your hand.`,
    `If you have at least eight cards in your hand, you win.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndReveal(player, 11);
      if (card) {
        const color = card.color;
        game.aSplay(player, color, 'aslant');
        
        const cards = game.getCardsByZone(player, color);
        if (cards.length > 4) {
          const toReturn = cards.slice(0, cards.length - 4);
          game.aReturnMany(player, toReturn);
        }
      }
    },
    
    (game, player) => {
      const handSize = game.getZoneByPlayer(player, 'hand').cards().length;
      if (handSize >= 8) {
        throw new GameOverEvent({
          player,
          reason: this.name
        });
      } else {
        game.mLogNoEffect();
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