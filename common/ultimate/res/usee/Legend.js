const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Legend`  // Card names are unique in Innovation
  this.name = `Legend`
  this.color = `purple`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `hlls` 
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a non-purple color. Self-execute your top card of that color. Score your top card of that color. If you do, repeat this effect with the same color if you have scored fewer than nine points due to Legend during this action.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const colors = ['red', 'blue', 'green', 'yellow']
      const chosenColor = game.aChooseColor(player, colors, {
        title: 'Choose a non-purple color'
      })
      
      let totalScored = 0
      while (true) {
        const topCardOfColor = game.getTopCard(player, chosenColor)
        if (!topCardOfColor) break

        game.mLog({
          template: '{player} self-executes {card}',
          args: { player, card: topCardOfColor }
        })        
        game.aCardEffects(player, topCardOfColor, 'dogma')
        
        const scoreCard = game.getTopCard(player, chosenColor)
        if (scoreCard) {
          game.mLog({
            template: '{player} scores {card}',
            args: { player, card: scoreCard }
          })
          const scoredCard = game.aScore(player, scoreCard)
          if (scoredCard) {
            totalScored += scoredCard.data.age  
          }
        }

        if (totalScored >= 9) break
      }
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