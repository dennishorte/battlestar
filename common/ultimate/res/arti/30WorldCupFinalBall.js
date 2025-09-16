const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `'30 World Cup Final Ball`  // Card names are unique in Innovation
  this.name = `'30 World Cup Final Ball`
  this.color = `purple`
  this.age = 8
  this.expansion = `arti`
  this.biscuits = `llih`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to return one of your achievements!`,
    `Draw and reveal an {8}. The single player with the highest top card of the drawn card's color achieves it, ignoring eligibility. If that happens, repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aChooseAndReturn(player, game.getCardsByZone(player, 'achievements'))
    },

    (game, player) => {
      while (true) {
        const card = game.aDrawAndReveal(player, game.getEffectAge(this, 8))
        const orderedPlayers = game
          .getPlayerAll()
          .map(player => ({ player, card: game.getTopCard(player, card.color) }))
          .filter(x => x.card !== undefined)
          .map(({ player, card }) => ({ player, age: card.getAge() }))
          .sort((l, r) => r.age - l.age)

        if (
          orderedPlayers.length === 1
          || (orderedPlayers.length > 1 && orderedPlayers[0].age > orderedPlayers[1].age)
        ) {
          game.aClaimAchievement(orderedPlayers[0].player, card)

        }
        else {
          game.mLog({
            template: 'No single player has the highest top card.'
          })
          break
        }
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
