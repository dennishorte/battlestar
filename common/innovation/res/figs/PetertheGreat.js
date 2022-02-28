const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Peter the Great`  // Card names are unique in Innovation
  this.name = `Peter the Great`
  this.color = `red`
  this.age = 5
  this.expansion = `figs`
  this.biscuits = `f*5h`
  this.dogmaBiscuit = `f`
  this.inspire = `Tuck a card from your hand.`
  this.echo = ``
  this.karma = [
    `When you meld this card, return all opponents' top figures.`,
    `If you would tuck a card with a {f}, first achieve your bottom green card, if elibible. Otherwise, score it.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'))
  }
  this.karmaImpl = [
    {
      trigger: 'when-meld',
      func: (game, player) => {
        const figs = game
          .getPlayerOpponents(player)
          .flatMap(player => game.getTopCards(player))
          .filter(card => card.expansion === 'figs')
        game.aReturnMany(player, figs)
      }
    },
    {
      trigger: 'tuck',
      kind: 'would-first',
      matches: (game, player, { card }) => card.checkHasBiscuit('f'),
      func: (game, player) => {
        const card = game.getCardsByZone(player, 'green').slice(-1)[0]
        if (card) {
          if (game.checkAchievementEligibility(player, card)) {
            game.aClaimAchievement(player, card)
          }
          else {
            game.aScore(player, card)
          }
        }
        else {
          game.mLogNoEffect()
        }
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
