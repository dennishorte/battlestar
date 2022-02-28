const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Confucius`  // Card names are unique in Innovation
  this.name = `Confucius`
  this.color = `purple`
  this.age = 2
  this.expansion = `figs`
  this.biscuits = `hl&3`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Score an opponent's top figure of value 1.`
  this.karma = [
    `If you would take a Dogma action and activate a card with a {k} as a featured icon, instead choose any other icon on your board as the featured icon.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    const choices = game
      .getPlayerOpponents(player)
      .flatMap(opp => game.getTopCards(opp))
      .filter(card => card.expansion === 'figs')
      .filter(card => card.age === 1)
    game.aChooseAndScore(player, choices)
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'featured-biscuit',
      matches: (game, player, { biscuit }) => biscuit === 'k',
      func: (game, player) => {
        const biscuits = game.getBiscuitsByPlayer(player)
        const choices = Object
          .entries(biscuits)
          .filter(([biscuit, count]) => count > 0)
          .map(([biscuit, count]) => biscuit)
          .filter(biscuit => biscuit !== 'k')

        const biscuit = game.requestInputSingle({
          actor: player.name,
          title: 'Choose a Biscuit',
          choices,
        })[0]

        return biscuit
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
