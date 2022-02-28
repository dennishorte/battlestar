const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `H.G. Wells`  // Card names are unique in Innovation
  this.name = `H.G. Wells`
  this.color = `purple`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `l*hl`
  this.dogmaBiscuit = `l`
  this.inspire = `Draw and foreshadow a {0}.`
  this.echo = ``
  this.karma = [
    `If you would foreshadow a card, instead meld it, execute its non-demand Dogma effects for yourself only, and remove it from the game if it is still a top card on your board.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDrawAndForeshadow(player, game.getEffectAge(this, 10))
  }
  this.karmaImpl = [
    {
      trigger: 'foreshadow',
      kind: 'would-instead',
      matches: () => true,
      func: (game, player, { card }) => {
        game.aMeld(player, card)
        game.aCardEffects(
          player,
          player,
          card,
          'dogma',
          game.getBiscuitsByPlayer(player),
        )
        const topCard = game.getTopCard(player, card.color)
        if (topCard === card) {
          game.aRemove(player, card)
        }
        else {
          game.mLog({
            template: "{card} is no longer a top card on {player}'s board",
            args: { card, player }
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
