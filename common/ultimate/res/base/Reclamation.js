const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Reclamation`  // Card names are unique in Innovation
  this.name = `Reclamation`
  this.color = `yellow`
  this.age = 11
  this.expansion = `base`
  this.biscuits = `clhl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return your three bottom red cards. Draw and meld a card of value equal to half the total sum value of the returned cards, rounded up. If you return three cards, repeat this effect using the color of the melded card.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const doEffect = (color) => {
        const cards = game.getCardsByZone(player, color);

        // Get the bottom three cards
        const bottomThree = cards.slice(Math.max(0, cards.length - 3));
        const returned = game.aReturnMany(player, bottomThree, { ordered: true });

        // Calculate sum of values
        const totalValue = bottomThree.reduce((sum, card) => sum + card.getAge(), 0);
        const drawValue = Math.ceil(totalValue / 2);

        game.mLog({
          template: 'Sum of returned cards is {total}, drawing and melding a {value}',
          args: { total: totalValue, value: drawValue }
        });

        const meldedCard = game.aDrawAndMeld(player, drawValue);
        return { meldedCard, returnedCount: returned.length }
      };

      const { meldedCard, returnedCount } = doEffect('red');
      if (meldedCard && returnedCount === 3) {
        game.mLog({
          template: '{player} repeats the effect using {color}',
          args: { player, color: meldedCard.color }
        });

        doEffect(meldedCard.color);
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
