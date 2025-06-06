const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Consulting`  // Card names are unique in Innovation
  this.name = `Consulting`
  this.color = `blue`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `hffc`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose an opponent. Draw and meld two {10}. Super-execute the top card on your board of that player's choice.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const opponent = game.aChoosePlayer(player, game.players.opponentsOf(player))

      game.aDrawAndMeld(player, game.getEffectAge(this, 10))
      game.aDrawAndMeld(player, game.getEffectAge(this, 10))

      const topCards = game.getTopCards(player)
      const card = game.aChooseCard(opponent, topCards)

      game.log.add({
        template: '{opponent} chooses {card} for {player} to execute',
        args: { opponent, player, card }
      })

      game.aSuperExecute(player, card)
    },
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
