const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Domestication`  // Card names are unique in Innovation
  this.name = `Domestication`
  this.color = `yellow`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `kchk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld the lowest card in your hand. Draw a {1}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const sortedCards = game
        .getZoneByPlayer(player, 'hand')
        .cards()
        .sort((l, r) => l.age = r.age)

      if (sortedCards.length === 0) {
        game.mLog({
          template: '{player} melds nothing',
          args: { player }
        })
      }
      else {
        const lowestCards = sortedCards
          .filter(c => c.age === sortedCards[0].age)
          .map(c => c.name)

        const cards = game
          .requestInputSingle({
            actor: player.name,
            title: "Choose a Lowest Card",
            choices: lowestCards
          })
          .map(c => game.getCardByName(c))
        game.aMeld(player, cards[0])
      }

      game.aDraw(player, { age: game.getEffectAge(this, 1) })
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
