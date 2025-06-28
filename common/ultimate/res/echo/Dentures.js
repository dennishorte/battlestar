const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Dentures`  // Card names are unique in Innovation
  this.name = `Dentures`
  this.color = `yellow`
  this.age = 6
  this.expansion = `echo`
  this.biscuits = `&ffh`
  this.dogmaBiscuit = `f`
  this.echo = `Draw and tuck a {6}.`
  this.karma = []
  this.dogma = [
    `Score the top two non-bottom cards of the color of the last card you tucked due to Dentures. If there are none to score, draw and tuck a {6}, then repeat this dogma effect.`,
    `You may splay your blue cards right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      if (!game.state.dogmaInfo.dentures) {
        game.mLog({
          template: "No cards scored with Dentures's echo effect"
        })
        return
      }

      let card = game.state.dogmaInfo.dentures[player.name]

      while (true) {
        if (card) {
          const cards = game.getCardsByZone(player, card.color)
          game.mLog({
            template: '{player} will try to score {color}',
            args: { player, color: card.color }
          })

          if (cards.length === 1) {
            game.mLog({
              template: '{player} has no non-bottom {color} cards',
              args: { player, color: card.color }
            })
            card = game.aDrawAndTuck(player, game.getEffectAge(this, 6))
            continue
          }
          if (cards.length > 1) {
            game.aScore(player, cards[0])
          }
          if (cards.length > 2) {
            game.aScore(player, cards[1])
          }
          break
        }
        else {
          game.mLogNoEffect()
          break
        }
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['blue'], 'right')
    }
  ]
  this.echoImpl = (game, player) => {
    const card = game.aDrawAndTuck(player, game.getEffectAge(this, 6))

    if (!game.state.dogmaInfo.dentures) {
      game.state.dogmaInfo.dentures = {}
    }

    game.state.dogmaInfo.dentures[player.name] = card
  }
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
