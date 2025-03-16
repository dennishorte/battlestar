const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Bandage`  // Card names are unique in Innovation
  this.name = `Bandage`
  this.color = `red`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `l&hl`
  this.dogmaBiscuit = `l`
  this.echo = `Meld a card from hand with a {l}.`
  this.karma = []
  this.dogma = [
    `I demand you return the highest card in your score pile for which you do not have a card of matching value in your hand! Return a top card from your board with a {i}!`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const handAges = game
        .getCardsByZone(player, 'hand')
        .map(card => card.getAge())
      const choices = game
        .getCardsByZone(player, 'score')
        .filter(card => !handAges.includes(card.getAge()))
      const highest = game.utilHighestCards(choices)
      game.aChooseAndReturn(player, highest)

      const boardChoices = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('i'))
      game.aChooseAndReturn(player, boardChoices)
    }
  ]
  this.echoImpl = (game, player) => {
    const choices = game
      .getCardsByZone(player, 'hand')
      .filter(card => card.checkHasBiscuit('l'))
    game.aChooseAndMeld(player, choices)
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
