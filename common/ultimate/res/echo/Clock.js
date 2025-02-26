const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Clock`  // Card names are unique in Innovation
  this.name = `Clock`
  this.color = `purple`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `&5hs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `You may splay your color with the most cards right.`
  this.karma = []
  this.dogma = [
    `I demand you draw and reveal three {0}, total the number of {i} on them, and then return them! Transfer all cards of that value from your hand and score pile to my score pile!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const drawn = [
        game.aDrawAndReveal(player, game.getEffectAge(this, 10)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 10)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 10)),
      ].filter(card => card !== undefined)

      const totalClocks = drawn
        .map(card => card.biscuits.split('').filter(b => b === 'i').length)
        .reduce((agg, r) => agg + r, 0)

      game.mLog({ template: `Total {i} is ${totalClocks}.` })

      game.aReturnMany(player, drawn)

      const toTransfer = [
        game.getCardsByZone(player, 'hand').filter(card => card.getAge() === totalClocks),
        game.getCardsByZone(player, 'score').filter(card => card.getAge() === totalClocks),
      ].flat()

      game.aTransferMany(player, toTransfer, game.getZoneByPlayer(leader, 'score'))
    }
  ]
  this.echoImpl = (game, player) => {
    const colorStacks = game
      .utilColors()
      .map(color => game.getZoneByPlayer(player, color))

    const mostCards = colorStacks
      .map(zone => zone.cards().length)
      .sort((l, r) => r - l)[0]

    const choices = colorStacks
      .filter(zone => zone.cards().length === mostCards)
      .map(zone => zone.color)

    game.aChooseAndSplay(player, choices, 'right')
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
