const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Necronomicon`  // Card names are unique in Innovation
  this.name = `Necronomicon`
  this.color = `purple`
  this.age = 3
  this.expansion = `arti`
  this.biscuits = `hlll`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {3}. If it is yellow, return all cards in your hand. If it is green, unsplay all your stacks. If it is red, return all cards in your score pile. If it is blue, draw a {9}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 3))
      if (card) {
        game.mLog({ template: `Card is ${card.color}` })

        if (card.color === 'yellow') {
          game.mLog({
            template: '{player} will return all cards from hand',
            args: { player }
          })
          game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
        }

        else if (card.color === 'green') {
          game.mLog({
            template: '{player} will unsplay all stacks',
            args: { player }
          })
          for (const color of game.utilColors()) {
            game.aUnsplay(player, color)
          }
        }

        else if (card.color === 'red') {
          game.mLog({
            template: '{player} will return all cards from score',
            args: { player }
          })
          game.aReturnMany(player, game.getCardsByZone(player, 'score'))
        }

        else if (card.color === 'blue') {
          game.mLog({
            template: '{player} will draw a {9}',
            args: { player }
          })
          game.aDraw(player, { age: game.getEffectAge(this, 9) })
        }

        else {
          game.mLogNoEffect()
        }
      }
    }
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
