const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `John Von Neumann`  // Card names are unique in Innovation
  this.name = `John Von Neumann`
  this.color = `red`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `hii&`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = `Draw and reveal two {9}. If either is purple, return them.`
  this.karma = [
    `When you meld this card, return all opponents' top figures.`,
    `Each card in your hand provides two additional {i}.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    const card1 = game.aDraw(player, { age: game.getEffectAge(this, 9) })
    const card2 = game.aDraw(player, { age: game.getEffectAge(this, 9) })

    if (card1.color === 'purple' || card2.color === 'purple') {
      game.mLog({
        template: '{player} drew a purple card',
        args: { player }
      })
      game.aReturnMany(player, [card1, card2])
    }
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'when-meld',
      func: (game, player) => {
        const figures = game
          .getPlayerOpponents(player)
          .flatMap(player => game.getTopCards(player))
          .filter(card => card.expansion === 'figs')
        game.aReturnMany(player, figures)
      }
    },
    {
      trigger: 'calculate-biscuits',
      func: (game, player) => {
        const output = game.utilEmptyBiscuits()
        output.i = game.getCardsByZone(player, 'hand').length * 2
        return output
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
