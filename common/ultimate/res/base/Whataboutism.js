const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Whataboutism`  // Card names are unique in Innovation
  this.name = `Whataboutism`
  this.color = `purple`
  this.age = 11
  this.expansion = `base`
  this.biscuits = `shps`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a top card with a demand effect of each color from your board to my board! If you transfer any cards, exchange all cards in your score pile with all cards in my score pile!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const topDemands = game
        .getTopCards(player)
        .filter(card => card.dogma.some(effect => {
          return effect.toLowerCase().startsWith('i demand') || effect.toLowerCase().startsWith('i compel')
        }))

      let transferred = false
      for (const card of topDemands) {
          const result = game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color));
          if (result) {
            transferred = true;
          }
      }

      if (transferred) {
        const yours = game.getCardsByZone(player, 'score');
        const mine = game.getCardsByZone(leader, 'score');

        game.mLog({
          template: '{player} exchanges score pile with {leader}',
          args: { player, leader }
        });

        // Exchange score piles
        for (const card of yours) {
          game.mMoveCardTo(card, game.getZoneByPlayer(leader, 'score'))
        }
        for (const card of mine) {
          game.mMoveCardTo(card, game.getZoneByPlayer(player, 'score'))
        }
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
