const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Safe Deposit Box`  // Card names are unique in Innovation
  this.name = `Safe Deposit Box`
  this.color = `red`
  this.age = 7
  this.expansion = `usee`
  this.biscuits = `hcic`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may choose to either draw and junk two {7}, or exchange all cards in your score pile with all valued cards in the junk.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const options = ['Draw and junk', 'Exchange']
      const choice = game.actions.choose(player, options, {
        title: 'Choose an option'
      })[0]

      if (choice === 'Draw and junk') {
        game.aDrawAndJunk(player, game.getEffectAge(this, 7))
        game.aDrawAndJunk(player, game.getEffectAge(this, 7))
      }
      else if (choice === 'Exchange') {
        const scoreCards = game.getCardsByZone(player, 'score')
        const valuedJunkCards = game
          .getZoneById('junk')
          .cards()
          .filter(card => card.age !== undefined)

        game.aExchangeCards(
          player,
          scoreCards,
          valuedJunkCards,
          game.getZoneByPlayer(player, 'score'),
          game.getZoneById('junk'),
        )

        game.log.add({
          template: '{player} exchanges their score with the valued cards in junk',
          args: { player },
        })
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
