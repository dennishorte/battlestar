const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pen Name`  // Card names are unique in Innovation
  this.name = `Pen Name`
  this.color = `purple`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `fhfs`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose to either splay an unsplayed non-purple color on your board left and self-execute its top card, or meld a card from your hand and splay its color on your board right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = []

      const unsplayed = game
        .utilColors()
        .filter(c => c !== 'purple')
        .map(c => game.getZoneByPlayer(player, c))
        .filter(z => z.splay === 'none')
        .map(z => z.color)

      if (unsplayed.length > 0) {
        choices.push({
          title: 'Splay left and self-execute',
          choices: unsplayed,
          min: 0,
          max: 1,
        })
      }

      const handCards = game.getCardsByZone(player, 'hand')

      if (handCards.length > 0) {
        choices.push({
          title: 'Meld and splay right',
          choices: handCards.map(c => c.name),
          min: 0,
          max: 1,
        })
      }

      const selected = game.actions.choose(player, choices, { title: 'Choose one:' })[0]

      if (selected.title === 'Splay left and self-execute') {
        const color = selected.selection[0]
        game.aSplay(player, color, 'left')
        const topCard = game.getTopCard(player, color)
        if (topCard) {
          game.aSelfExecute(player, topCard)
        }
      }
      else if (selected.title === 'Meld and splay right') {
        const card = game.getCardByName(selected.selection[0])
        game.aMeld(player, card)
        game.aSplay(player, card.color, 'right')
      }
    },
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
