const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Amina Sukhera`  // Card names are unique in Innovation
  this.name = `Amina Sukhera`
  this.color = `red`
  this.age = 4
  this.expansion = `figs`
  this.biscuits = `f*fh`
  this.dogmaBiscuit = `f`
  this.inspire = `Score all bottom purple cards.`
  this.echo = ``
  this.karma = [
    `When you meld this card, score all opponents' top figures of value 4.`,
    `Each top card with a {k} on your board counts as an available achievement for you.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    const cards = game
      .getPlayerAll()
      .map(p => game.getZoneByPlayer(p, 'purple').cards().slice(-1)[0])
      .filter(card => card !== undefined)
    game.aScoreMany(player, cards)
  }
  this.karmaImpl = [
    {
      trigger: 'when-meld',
      func(game, player) {
        for (const opp of game.getPlayerOpponents(player)) {
          const topFigures = game
            .getTopCards(opp)
            .filter(card => card.expansion === 'figs')
            .filter(card => card.age === 4)
          game.aScoreMany(player, topFigures)
        }
      }
    },
    {
      trigger: 'list-achievements',
      func(game, player) {
        return game
          .getTopCards(player)
          .filter(card => card.biscuits.includes('k'))
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
