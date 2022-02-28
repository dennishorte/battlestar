const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mapmaking`  // Card names are unique in Innovation
  this.name = `Mapmaking`
  this.color = `green`
  this.age = 2
  this.expansion = `base`
  this.biscuits = `hcck`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a {1} from your score pile, if it has any, to my score pile.`,
    `If any card was transferred due to the demand, draw and score a {1}.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game
        .getZoneByPlayer(player, 'score')
        .cards()
        .filter(card => card.age === game.getEffectAge(this, 1))
        .map(card => card.id)
      const target = game.getZoneByPlayer(leader, 'score')
      const transferredCards = game.aChooseAndTransfer(player, choices, target)

      if (transferredCards.length > 0) {
        game.state.dogmaInfo.transferred = true
      }
    },

    (game, player) => {
      if (game.state.dogmaInfo.transferred) {
        game.aDrawAndScore(player, game.getEffectAge(this, 1))
      }
      else {
        game.mLogNoEffect()
      }
    },
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
