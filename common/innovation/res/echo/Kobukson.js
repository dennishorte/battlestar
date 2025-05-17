const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Kobukson`  // Card names are unique in Innovation
  this.name = `Kobukson`
  this.color = `red`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `5fh&`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Splay left one color on any player's board.`
  this.karma = []
  this.dogma = [
    `I demand you return all your top cards with a {k}! Draw and tuck a {4}!`,
    `For every two cards returned as a result of the demand, draw and tuck a {4}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      if (!game.state.dogmaInfo.kobukson) {
        game.state.dogmaInfo.kobukson = 0
      }

      const toReturn = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('k'))
      const returned = game.aReturnMany(player, toReturn)

      if (returned && returned.length > 0) {
        game.state.dogmaInfo.kobukson += returned.length
      }

      game.aDrawAndTuck(player, game.getEffectAge(this, 4))
    },

    (game, player) => {
      const count = Math.floor(game.state.dogmaInfo.kobukson / 2)
      game.log.add({
        template: `${game.state.dogmaInfo.kobukson} cards were returned due to the demand`
      })

      for (let i = 0; i < count; i++) {
        game.aDrawAndTuck(player, game.getEffectAge(this, 4))
      }
    },
  ]
  this.echoImpl = (game, player) => {
    const choices = game
      .players.all()
      .flatMap(player => game.utilColors().map(color => ({ player, color })))
      .map(x => `${x.player.name} ${x.color}`)

    const toSplayLeft = game.aChoose(player, choices, { title: 'Choose a stack to splay left' })
    if (toSplayLeft && toSplayLeft.length > 0) {
      const [playerName, color] = toSplayLeft[0].split(' ')
      const target = game.players.byName(playerName)
      game.aSplay(player, color, 'left', { owner: target })
    }
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
