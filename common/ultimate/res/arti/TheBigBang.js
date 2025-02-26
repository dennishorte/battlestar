const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `The Big Bang`  // Card names are unique in Innovation
  this.name = `The Big Bang`
  this.color = `purple`
  this.age = 9
  this.expansion = `arti`
  this.biscuits = `shss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Execute the non-demand effects of your top blue card, without sharing. If this caused any change to occur, draw and remove a {0} from the game, then repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        game.state.dogmaInfo.theBigBangChange = false

        const card = game.getTopCard(player, 'blue')
        if (card) {
          game.aCardEffects(player, card, 'echo')
          game.aCardEffects(player, card, 'dogma')

          if (game.state.dogmaInfo.theBigBangChange) {
            game.mLog({ template: 'The game state was changed due to the card effects.' })
            const card = game.aDraw(player, { age: game.getEffectAge(this, 10) })
            game.aRemove(player, card)
            continue
          }
          else {
            game.mLog({ template: 'No changes due to card effects' })
            break
          }
        }
        else {
          game.mLog({ template: 'No top blue card' })
          break
        }
      }
    }
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
