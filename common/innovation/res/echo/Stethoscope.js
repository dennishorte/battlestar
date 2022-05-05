const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Stethoscope`  // Card names are unique in Innovation
  this.name = `Stethoscope`
  this.color = `blue`
  this.age = 6
  this.expansion = `echo`
  this.biscuits = `s&sh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Meld a blue or yellow card from your hand.`
  this.karma = []
  this.dogma = [
    `Draw a {7}. If you melded a blue card due to Stethoscope's echo effect, draw an {8}.`,
    `You may splay your yellow cards right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDraw(player, { age: game.getEffectAge(this, 7) })

      const melded = game.state.dogmaInfo.stethoscope[player.name]
      if (melded && melded.color === 'blue') {
        game.aDraw(player, { age: game.getEffectAge(this, 8) })
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['yellow'], 'right')
    }
  ]
  this.echoImpl = (game, player) => {
    const choices = game
      .getCardsByZone(player, 'hand')
      .filter(card => card.color === 'yellow' || card.color === 'blue')
    const melded = game.aChooseAndMeld(player, choices)

    if (!game.state.dogmaInfo.stethoscope) {
      game.state.dogmaInfo.stethoscope = {}
    }
    game.state.dogmaInfo.stethoscope[player.name] = melded[0]
  }
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
