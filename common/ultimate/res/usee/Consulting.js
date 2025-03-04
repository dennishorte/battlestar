const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Consulting`  // Card names are unique in Innovation
  this.name = `Consulting`
  this.color = `blue`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `hffc`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose an opponent. Draw and meld two {9}. Execute the top card on your board of that player's choice.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const opponent = game.aChoosePlayer(player, game.getPlayerOpponents(player))
      
      game.aDrawAndMeld(player, game.getEffectAge(this, 9))
      game.aDrawAndMeld(player, game.getEffectAge(this, 9))

      const topCards = game.getTopCards(player)
      const card = game.aChooseCard(opponent, topCards)
      
      game.mLog({
        template: '{opponent} chooses {card} for {player} to execute',
        args: { opponent, player, card }  
      })
      
      game.aCardEffects(player, card, 'dogma')
    },
  ]
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card