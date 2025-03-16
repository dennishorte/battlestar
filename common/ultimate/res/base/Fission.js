const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Fission`  // Card names are unique in Innovation
  this.name = `Fission`
  this.color = `red`
  this.age = 9
  this.expansion = `base`
  this.biscuits = `hiii`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw and reveal a {0}! If it is red, junk all players' non-achievement cards, and the Dogma action is complete!`,
    `Return a top card other than Fission from any player's board. Draw a {0}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 10))
      if (card.color === 'red') {
        game.mLog({ template: 'The card was red. Nuclear War!' })
        game.mLogIndent()

        const zones = ['red', 'yellow', 'green', 'blue', 'purple', 'hand', 'score', 'forecast', 'museum', 'safe']
        const toRemove = game
          .getPlayerAll()
          .flatMap(player => zones.flatMap(name => game.getCardsByZone(player, name)))
        game.aRemoveMany(player, toRemove, { ordered: true })
        game.mLogOutdent()

        game.state.dogmaInfo.earlyTerminate = true
        return
      }
      else {
        game.mLog({ template: 'The card was not red.' })
      }
    },

    (game, player) => {
      game.aChooseAndReturn(player, game.getTopCardsAll())
      game.aDraw(player, { age: game.getEffectAge(this, 10) })
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
