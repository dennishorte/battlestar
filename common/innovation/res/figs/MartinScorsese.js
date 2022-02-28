const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Martin Scorsese`  // Card names are unique in Innovation
  this.name = `Martin Scorsese`
  this.color = `purple`
  this.age = 10
  this.expansion = `figs`
  this.biscuits = `fha&`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Draw and meld a {0}.`
  this.karma = [
    `If you would meld a figure, instead tuck the figure and claim a standard achievement, regardless of eligibility.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    game.aDrawAndMeld(player, game.getEffectAge(this, 10))
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => card.expansion === 'figs',
      func: (game, player, { card }) => {
        game.aTuck(player, card)
        const choices = game
          .getZoneById('achievements')
          .cards()
          .filter(card => !card.isSpecialAchievement)
        const formatted = game.formatAchievements(choices)
        const selected = game.aChoose(player, formatted)
        game.aAchieveAction(player, selected[0], { nonAction: true })
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
