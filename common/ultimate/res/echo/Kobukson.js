const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Kobukson`  // Card names are unique in Innovation
  this.name = `Kobukson`
  this.color = `red`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `5fh&`
  this.dogmaBiscuit = `f`
  this.echo = `Splay left a color on any player's board.`
  this.karma = []
  this.dogma = [
    `I demand you return a top card with {k} of each color on your board! Draw and tuck a {4}!`,
    `Draw and tuck a {4}.`,
    `If Kobukson was foreseen, draw and meld a {5}.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      const toReturn = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('k'))
      const returned = game.aReturnMany(player, toReturn)

      game.aDrawAndTuck(player, game.getEffectAge(this, 4))
    },

    (game, player) => {
      game.aDrawAndTuck(player, game.getEffectAge(this, 4))
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        game.mLogWasForeseen(self)
        game.aDrawAndMeld(player, game.getEffectAge(this, 5))
      }
    }
  ]
  this.echoImpl = (game, player) => {
    const choices = game
      .getPlayerAll()
      .flatMap(player => game.utilColors().map(color => ({ player, color })))
      .map(x => `${x.player.name} ${x.color}`)

    const toSplayLeft = game.aChoose(player, choices, { title: 'Choose a stack to splay left' })
    if (toSplayLeft && toSplayLeft.length > 0) {
      const [playerName, color] = toSplayLeft[0].split(' ')
      const target = game.getPlayerByName(playerName)
      game.aSplay(player, color, 'left', { owner: target })
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
