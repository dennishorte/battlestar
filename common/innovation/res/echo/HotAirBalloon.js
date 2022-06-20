const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hot Air Balloon`  // Card names are unique in Innovation
  this.name = `Hot Air Balloon`
  this.color = `green`
  this.age = 6
  this.expansion = `echo`
  this.biscuits = `s&h7`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw and score a {7}.`
  this.karma = []
  this.dogma = [
    `You may achieve (if eligible) a top card from any other player's board if they have an achievement of matching value. If you do, transfer your top green card to that player's board. Otherwise, draw and meld a {7}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const candidates = []
      for (const other of game.getPlayerAll()) {
        if (other === player) {
          continue
        }

        // The ages of all achievements owned by `other`.
        const ages = game
          .getCardsByZone(other, 'achievements')
          .filter(card => !!card.getAge())
          .map(card => card.getAge())

        // Top cards owned by `other` that match an age in that player's achievements pile.
        game
          .getTopCards(other)
          .filter(card => ages.includes(card.getAge()))
          .filter(card => game.checkAchievementEligibility(player, card))
          .forEach(card => candidates.push(card))
      }

      const card = game.aChooseCard(player, candidates, { min: 0, max: 1 })
      if (card) {
        const owner = game.getPlayerByCard(card)
        game.aClaimAchievement(player, { card })
        game.aTransfer(player, game.getTopCard(player, 'green'), game.getZoneByPlayer(owner, 'green'))
      }
      else {
        game.aDrawAndMeld(player, game.getEffectAge(this, 7))
      }
    }
  ]
  this.echoImpl = (game, player) => {
    game.aDrawAndScore(player, game.getEffectAge(this, 7))
  }
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
