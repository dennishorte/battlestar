const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Denver Airport`  // Card names are unique in Innovation
  this.name = `Denver Airport`
  this.color = `green`
  this.age = 10
  this.expansion = `usee`
  this.biscuits = `cchp`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may achieve one of your secrets regardless of eligibility.`,
    `You may splay your purple cards up.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const secrets = game.getCardsByZone(player, 'safe')
      const card = game.actions.chooseCards(player, secrets, {
        title: 'Choose a card to achieve',
        hidden: true,
        min: 0,
      })[0]

      if (card) {
        game.aClaimAchievement(player, { card })
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['purple'], 'up')
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
