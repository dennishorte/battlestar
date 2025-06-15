const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mona Lisa`  // Card names are unique in Innovation
  this.name = `Mona Lisa`
  this.color = `yellow`
  this.age = 4
  this.expansion = `arti`
  this.biscuits = `hcll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a number and a color. Draw five {4}, then reveal your hand. If you have exactly that many cards of that color, score them, and splay right your cards of that color. Otherwise, return all cards from your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const number = game.actions.choose(player, [0,1,2,3,4,5,6,7,8,9], { title: 'Choose a number' })[0]
      const color = game.actions.choose(player, game.utilColors(), { title: 'Choose a color' })[0]

      game.log.add({
        template: '{player} chooses {number} {color}',
        args: { player, number, color }
      })

      game.aDraw(player, { age: game.getEffectAge(this, 4) })
      game.aDraw(player, { age: game.getEffectAge(this, 4) })
      game.aDraw(player, { age: game.getEffectAge(this, 4) })
      game.aDraw(player, { age: game.getEffectAge(this, 4) })
      game.aDraw(player, { age: game.getEffectAge(this, 4) })

      const hand = game.getCardsByZone(player, 'hand')

      for (const card of hand) {
        game.mReveal(player, card)
      }

      const matches = hand.filter(card => card.color === color)
      const matchCount = matches.length === number

      game.log.add({
        template: '{player} has {count} {color}',
        args: { player, count: matches.length, color }
      })

      if (matchCount) {
        game.log.add({
          template: '{player} guessed correctly',
          args: { player }
        })
        game.aScoreMany(player, matches)
        game.aSplay(player, color, 'right')
      }
      else {
        game.log.add({
          template: '{player} did not guess correctly',
          args: { player }
        })
        game.aReturnMany(player, hand)
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
