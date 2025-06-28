const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Jet`  // Card names are unique in Innovation
  this.name = `Jet`
  this.color = `red`
  this.age = 9
  this.expansion = `echo`
  this.biscuits = `h&ia`
  this.dogmaBiscuit = `i`
  this.echo = `Meld a card from your hand.`
  this.karma = []
  this.dogma = [
    `I demand you return your top card of the color I melded due to Jet's echo effect.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const melded = game.state.dogmaInfo.jet
      if (melded) {
        const toReturn = game.getTopCard(player, melded.color)
        if (toReturn) {
          game.aReturn(player, toReturn)
        }
        else {
          game.mLog({
            template: '{player} has no {color} top card',
            args: {
              player,
              color: melded.color
            }
          })
        }
      }

      else {
        game.mLog({
          template: 'No card was melded due to the echo effect.'
        })
      }
    }
  ]
  this.echoImpl = (game, player) => {
    if (!game.state.dogmaInfo.jet) {
      game.state.dogmaInfo.jet = ''
    }

    const cards = game.aChooseAndMeld(player, game.getCardsByZone(player, 'hand'))
    if (player === game.getPlayerByCard(this) && cards && cards.length > 0) {
      game.state.dogmaInfo.jet = cards[0]
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
