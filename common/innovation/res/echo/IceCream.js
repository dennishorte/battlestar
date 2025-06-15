const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ice Cream`  // Card names are unique in Innovation
  this.name = `Ice Cream`
  this.color = `purple`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `h8l&`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Score a non-purple top card from your board without a bonus.`
  this.karma = []
  this.dogma = [
    `I demand you draw and meld a {1}!`,
    `Choose the {6}, {7}, {8}, or {9} deck. If there is at least one card in that deck, you may transfer its bottom card to the available achievements.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDrawAndMeld(player, game.getEffectAge(this, 1))
    },

    (game, player) => {
      const addAchievement = game.actions.chooseYesNo(player, 'Transfer a card to the available achievements?')

      if (addAchievement) {
        const age = game.aChooseAge(player, [
          game.getEffectAge(this, 6),
          game.getEffectAge(this, 7),
          game.getEffectAge(this, 8),
          game.getEffectAge(this, 9),
        ].filter(age => age <= 10))

        const cards = game.getZoneByDeck('base', age).cards()
        if (cards.length > 0) {
          const toTransfer = cards[cards.length - 1]
          game.aTransfer(player, toTransfer, game.getZoneById('achievements'))
        }
      }
    }
  ]
  this.echoImpl = (game, player) => {
    const choices = game
      .getTopCards(player)
      .filter(card => card.color !== 'purple')
      .filter(card => !card.checkHasBonus())
    game.aChooseAndScore(player, choices)
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
