const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mafia`  // Card names are unique in Innovation
  this.name = `Mafia`
  this.color = `yellow`
  this.age = 7
  this.expansion = `usee` // Corrected expansion, matches card
  this.biscuits = `fhff`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer your lowest secret to my safe!`,
    `Tuck a card from any score pile.`,
    `You may splay your red or yellow cards right.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const opponentSecrets = game.getCardsByZone(player, 'safe')
      const lowestSecret = game.utilLowestCards(opponentSecrets)[0]

      if (!lowestSecret) {
        game.log.addNoEffect()
        return
      }

      game.aTransfer(player, lowestSecret, game.getZoneByPlayer(leader, 'safe'))
    },

    (game, player) => {
      const players = game
        .players.all(player)
        .filter(p => game.getCardsByZone(p, 'score').length > 0)
        .map(p => p.name)

      const targetName = game.aChoose(player, players, {
        title: 'Choose a player to tuck from'
      })[0]

      if (targetName) {
        const target = game.players.byName(targetName)

        const card = game.aChooseCards(player, game.getCardsByZone(target, 'score'), {
          title: 'Choose a card to tuck',
          hidden: targetName !== player.name
        })[0]

        game.aTuck(player, card)
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['red', 'yellow'], 'right')
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
