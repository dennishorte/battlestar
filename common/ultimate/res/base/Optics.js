const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Optics`  // Card names are unique in Innovation
  this.name = `Optics`
  this.color = `red`
  this.age = 3
  this.expansion = `base`
  this.biscuits = `ccch`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a {3}. If it has a {c}, draw and score a {4}. Otherwise, transfer a card from your score pile to the score pile of an opponent with fewer points than you.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndMeld(player, game.getEffectAge(this, 3))
      if (card) {
        if (card.checkHasBiscuit('c')) {
          game.log.add({
            template: '{card} has a {c} biscuit',
            args: { card }
          })
          game.aDrawAndScore(player, game.getEffectAge(this, 4))
        }
        else {
          game.log.add({
            template: '{card} does not have a {c} biscuit',
            args: { card }
          })
          const playerScore = game.getScore(player)
          const targets = game
            .getPlayerOpponents(player)
            .filter(other => game.getScore(other) < playerScore)

          if (targets.length > 0) {
            const targetPlayer = game.aChoosePlayer(player, targets)
            game.aChooseAndTransfer(
              player,
              game.getCardsByZone(player, 'score'),
              game.getZoneByPlayer(targetPlayer, 'score')
            )
          }
        }
      }
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
