const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Alex Trebek`  // Card names are unique in Innovation
  this.name = `Alex Trebek`
  this.color = `yellow`
  this.age = 10
  this.expansion = `figs`
  this.biscuits = `sh*s`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = [
    `If you would draw a card and have no figures of that value in hand, first say "Who is" and name a figure. Search the figures deck of that age for the named figure and take it into hand if present. Then shuffle that deck.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = [
    (game, player) => {
      const age = game.aChooseAge(player, [1,2,3,4,5,6,7,8,9,10])
      game.aDrawAndMeld(player, age)
    }
  ]
  this.karmaImpl = [
    {
      trigger: 'draw',
      matches(game, player, { age }) {
        const cardsOfSameAge = game
          .getZoneByPlayer(player, 'hand')
          .cards()
          .filter(card => card.getAge() === age)
          .filter(card => card.checkIsFigure())

        return cardsOfSameAge.length === 0
      },
      func(game, player, { age }) {
        const choices = game
          .getResources()
          .figs
          .byAge[age]
          .sort((l, r) => l.name.localeCompare(r.name))
        const card = game.aChooseCard(player, choices)

        game.mLog({
          template: '{player} says "Who is {name}?"',
          args: { player, name: card.name }
        })

        if (card.zone === card.home) {
          game.mMoveCardTo(card, game.getZoneByPlayer(player, 'hand'))
          game.mLog({
            template: '{player} takes {card} into hand',
            args: { player, card }
          })
          game.mReveal(player, card)
        }
        else {
          game.mLog({
            template: '{player} does not find {card} in the deck',
            args: { player, card }
          })
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
