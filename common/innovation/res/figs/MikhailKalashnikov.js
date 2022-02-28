const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mikhail Kalashnikov`  // Card names are unique in Innovation
  this.name = `Mikhail Kalashnikov`
  this.color = `red`
  this.age = 9
  this.expansion = `figs`
  this.biscuits = `*ffh`
  this.dogmaBiscuit = `f`
  this.inspire = `Tuck a card from your hand.`
  this.echo = ``
  this.karma = [
    `If you would tuck a red card, instead choose a top red card on an opponent's board. Either transfer it to your score pile, or execute its non-demand Dogma effects for yourself only.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'))
  }
  this.karmaImpl = [
    {
      trigger: 'tuck',
      kind: 'would-instead',
      matches: (game, player, { card }) => card.color === 'red',
      func: (game, player) => {
        const choices = game
          .getPlayerOpponents(player)
          .map(opp => game.getTopCard(opp, 'red'))
          .filter(card => card !== undefined)
        const selected = game.aChooseCard(player, choices)
        game.mLog({
          template: '{player} chooses {card}',
          args: {
            player,
            card: selected
          }
        })

        const action = game.aChoose(player, ['transfer it', 'execute it'])[0]

        if (action === 'transfer it') {
          game.aTransfer(player, selected, game.getZoneByPlayer(player, 'score'))
        }
        else {
          game.aCardEffects(player, player, selected, 'dogma', game.getBiscuits(player))
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
