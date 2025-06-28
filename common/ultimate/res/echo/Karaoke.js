const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Karaoke`  // Card names are unique in Innovation
  this.name = `Karaoke`
  this.color = `purple`
  this.age = 9
  this.expansion = `echo`
  this.biscuits = `hl9&`
  this.dogmaBiscuit = `l`
  this.echo = `Draw and meld a card of value less than {0}.`
  this.karma = []
  this.dogma = [
    `Execute all of the non-demand dogma effects of the card you melded due to Karaoke's echo effect. Do not share them.`,
    `You may take a bottom card from your board into your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      if (!game.state.dogmaInfo.karaoke) {
        game.mLogNoEffect()
        return
      }
      const card = game.state.dogmaInfo.karaoke[player.name]
      if (card) {
        game.aCardEffects(player, card, 'dogma')
      }
    },

    (game, player) => {
      const cards = game
        .utilColors()
        .map(color => game.getBottomCard(player, color))
        .filter(card => card !== undefined)

      game.aChooseAndTransfer(player, cards, game.getZoneByPlayer(player, 'hand'), { min: 0, max: 1 })
    }
  ]
  this.echoImpl = (game, player) => {
    if (!game.state.dogmaInfo.karaoke) {
      game.state.dogmaInfo.karaoke = {}
    }

    const effectAge = game.getEffectAge(this, 9)
    const ages = []
    for (let i = 1; i <= effectAge; i++) {
      ages.push(i)
    }

    const age = game.aChooseAge(player, ages)
    const card = game.aDrawAndMeld(player, age)
    if (card) {
      game.state.dogmaInfo.karaoke[player.name] = card
    }
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
