const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Queen Victoria`  // Card names are unique in Innovation
  this.name = `Queen Victoria`
  this.color = `purple`
  this.age = 7
  this.expansion = `figs`
  this.biscuits = `ss&h`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Transfer a figure from any score pile to yours.`
  this.karma = [
    `You may issue a Rivalry Decree with any two figures.`,
    `If you would claim a standard achievement, first make an achievement available from any lower non-empty age.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    const choices = game
      .getPlayerAll()
      .filter(other => other !== player)
      .flatMap(player => game.getCardsByZone(player, 'score'))
      .filter(card => card.expansion === 'figs')
    game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(player, 'score'))
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
    },
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: (game, player, { isStandard }) => isStandard,
      func: (game, player, { card }) => {
        const ages = game
          .getNonEmptyAges()
          .filter(age => age < card.age)
        const age = game.aChooseAge(player, ages)
        if (age) {
          const deckCards = game.getZoneByDeck('base', age).cards()
          const card = deckCards[deckCards.length - 1]
          game.mMoveCardTo(card, game.getZoneById('achievements'))
          game.mLog({
            template: '{player} moves {card} to the available achievements',
            args: { player, card }
          })
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
