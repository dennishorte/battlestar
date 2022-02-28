const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Benjamin Franklin`  // Card names are unique in Innovation
  this.name = `Benjamin Franklin`
  this.color = `blue`
  this.age = 6
  this.expansion = `figs`
  this.biscuits = `s&h6`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Take a top figure into your hand from any player's board. Meld it.`
  this.karma = [
    `You may issue an Advancement Decree with any two figures.`,
    `If you would meld a card, first draw and meld a card of one higher value.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    const choices = game
      .getPlayerAll()
      .flatMap(p => game.getTopCards(p))
      .filter(card => card.expansion === 'figs')

    const card = game.aChooseCard(player, choices)
    if (card) {
      game.mLog({
        template: '{player} takes {card} into their hand',
        args: { player, card }
      })
      game.mMoveCardTo(card, game.getZoneByPlayer(player, 'hand'))
      game.aMeld(player, card)
    }
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement',
    },
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func(game, player, { card }) {
        game.aDrawAndMeld(player, card.age + 1)
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
