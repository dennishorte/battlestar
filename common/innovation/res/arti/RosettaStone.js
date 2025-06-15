const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Rosetta Stone`  // Card names are unique in Innovation
  this.name = `Rosetta Stone`
  this.color = `blue`
  this.age = 2
  this.expansion = `arti`
  this.biscuits = `kkkh`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a card type. Draw two {2} of that type. Meld one and transfer the other to an opponent's board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const exp = game.actions.choose(player, game.getExpansionList(), { title: 'Choose a card type' })
      const cards = [
        game.aDraw(player, { age: game.getEffectAge(this, 2), exp }),
        game.aDraw(player, { age: game.getEffectAge(this, 2), exp }),
      ].filter(card => card !== undefined)

      const card = game.aChooseCard(player, cards, { title: 'Choose a card to meld' })
      game.aMeld(player, card)

      const otherCard = cards.filter(other => other !== card)[0]
      if (otherCard) {
        const opponent = game.aChoosePlayer(player, game.players.opponentsOf(player))
        game.aTransfer(player, otherCard, game.getZoneByPlayer(opponent, otherCard.color))
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
