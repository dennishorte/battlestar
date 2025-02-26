const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mask of Warka`  // Card names are unique in Innovation
  this.name = `Mask of Warka`
  this.color = `purple`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `kkhk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a color. Each player reveals all cards of that color from their hand. If you are the only player to reveal cards, return them and claim all achievements of value matching those cards, ignoring eligibility.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const color = game.aChoose(player, game.utilColors(), { title: 'Choose a Color' })[0]
      const revealedBy = []

      for (const plyr of game.getPlayersStarting(player)) {
        const toReveal = game
          .getCardsByZone(plyr, 'hand')
          .filter(card => card.color === color)
        const revealed = game.aRevealMany(plyr, toReveal, { ordered: true })
        if (revealed && revealed.length > 0) {
          revealedBy.push(plyr)
        }
      }

      if (revealedBy.length === 1 && revealedBy[0] === player) {
        const toReturn = game
          .getCardsByZone(player, 'hand')
          .filter(card => card.color === color)
        const returned = game.aReturnMany(player, toReturn)
        const toClaim = toReturn.map(card => card.getAge())
        const available = game
          .getAvailableAchievementsRaw(player)
          .filter(card => toClaim.includes(card.getAge()))
          .forEach(card => game.aClaimAchievement(player, { card }))
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
