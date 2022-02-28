const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Shivaji`  // Card names are unique in Innovation
  this.name = `Shivaji`
  this.color = `red`
  this.age = 5
  this.expansion = `figs`
  this.biscuits = `&ffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Transfer one of your top cards to the available achievements.`
  this.karma = [
    `You may issue a War Decree with any two figures.`,
    `If an opponent would claim an achievement that you are eligible to claim, instead you achieve it.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    game.aChooseAndTransfer(player, game.getTopCards(player), game.getZoneById('achievements'))
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'achieve',
      triggerAll: true,
      kind: 'would-instead',
      matches: (game, player, { card, owner }) => {
        return game.checkAchievementEligibility(owner, card)
      },
      func: (game, player, { card, owner }) => {
        game.aClaimAchievement(owner, card)
      }
    }
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
