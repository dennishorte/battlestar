const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Dice`  // Card names are unique in Innovation
  this.name = `Dice`
  this.color = `blue`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `h1cc`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal an Echoes {1}. If the card has a bonus, draw and meld a card of value equal to its bonus.`,
    `If Dice was foreseen, draw a {4}, then transfer it to the hand of an opponent with more bonus points than you.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDraw(player, { age: game.getEffectAge(this, 1), exp: 'echo' })
      game.mReveal(player, card)
      if (card.checkHasBonus()) {
        const bonus = card.getBonuses()[0]
        game.aDrawAndMeld(player, bonus)
      }
    },

    (game, player, { foreseen, card }) => {
      if (foreseen) {
        const card = game.aDraw(player, { age: game.getEffectAge(this, 4) })
        const playerBonusPoints = game.getBonuses(player).reduce((l, r) => l + r, 0)
        const otherBonusPoints = game
          .getPlayerOpponents(player)
          .map(opp => {
            const points = game.getBonuses(opp).reduce((l, r) => l + r, 0)
            return { opp, points }
          })

        const choices = otherBonusPoints
          .filter(x => x.points > playerBonusPoints)
          .map(x => x.opp)

        const opp = game.aChoosePlayer(player, choices, {
          title: 'Choose a player to transfer the drawn card to'
        })

        if (opp) {
          game.aTransfer(player, card, game.getZoneByPlayer(opp, 'hand'))
        }
      }
      else {
        game.mLogNoEffect()
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
