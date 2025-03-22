const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Cabal`  // Card names are unique in Innovation
  this.name = `Cabal`
  this.color = `red`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `hffc`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer all cards from your hand that have a value matching any of my secrets to my score pile! Draw a {5}!`,
    `Safeguard an available achievement of value equal to a top card on your board.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const leaderSecretAges = game
        .getCardsByZone(leader, 'safe')
        .map(card => card.getAge())

      const handCards = game
        .getCardsByZone(player, 'hand')
        .filter(card => leaderSecretAges.includes(card.getAge()))

      game.aTransferMany(player, handCards, game.getZoneByPlayer(leader, 'score'))

      game.aDraw(player, { age: game.getEffectAge(this, 5) })
    },

    (game, player) => {
      const topCardAges = game
        .getTopCards(player)
        .map(card => card.getAge())

      const availableAchievements = game
        .getAvailableAchievementsRaw(player)
        .filter(achievement => topCardAges.includes(achievement.getAge()))

      game.aChooseAndSafeguard(player, availableAchievements, { hidden: true })
    }
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
