const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Robert E. Lee`  // Card names are unique in Innovation
  this.name = `Robert E. Lee`
  this.color = `red`
  this.age = 7
  this.expansion = `figs`
  this.biscuits = `&hll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Transfer a top card with a {l} from anywhere to any player's board.`
  this.karma = [
    `You may issue a War Decree with any two figures.`,
    `Each seven {l} on your board counts as an achievement.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    const cardChoices = game
      .getTopCardsAll()
      .filter(card => card.checkHasBiscuit('l'))
    const card = game.aChooseCard(player, cardChoices)

    const targetPlayer = game.aChoosePlayer(player, game.getPlayerAll())
    const target = game.getZoneByPlayer(targetPlayer, card.color)

    game.aTransfer(player, card, target)
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'extra-achievements',
      func: (game, player) => {
        const leafBiscuits = game.getBiscuitsByPlayer(player).l
        return Math.floor(leafBiscuits / 7)
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
