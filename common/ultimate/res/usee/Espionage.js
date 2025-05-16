const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Espionage`
  this.name = `Espionage`
  this.color = `blue`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `khkk`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you reveal a card in your hand. If you do, and I have no card in my hand of the same color, transfer it to my hand, then repeat this effect!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      while (true) {
        const hand = game.getCardsByZone(player, 'hand')

        const revealed = game.aChooseAndReveal(player, hand, {
          title: 'Choose a card to reveal',
          count: 1,
        })[0]

        if (!revealed) {
          break
        }

        const leaderHand = game.getCardsByZone(leader, 'hand')
        game.log.add({
          template: '{player} reveals their hand',
          args: { player: leader }
        })
        game.aRevealMany(leader, leaderHand, { ordered: true })

        if (!leaderHand.some(c => c.color === revealed.color)) {
          game.mTransfer(player, revealed, game.getZoneByPlayer(leader, 'hand'))
          game.log.add({ template: 'Repeat this effect' })
        }
        else {
          break
        }
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
