const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Television`  // Card names are unique in Innovation
  this.name = `Television`
  this.color = `purple`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `8hi&`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = `Draw and meld an {8}.`
  this.karma = []
  this.dogma = [
    `Choose a value and and opponent. Transfer a card of that value from their score pile to their board. If they have an achievement of the same value, achieve (if eligible) a card of that value from their score pile.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const opponent = game.aChoosePlayer(player, game.players.opponentsOf(player))
      const age = game.aChooseAge(player)

      const choices = game
        .getCardsByZone(opponent, 'score')
        .filter(card => card.getAge() === age)
      const transferred = game.actions.chooseCard(player, choices)
      if (transferred) {
        game.aTransfer(player, transferred, game.getZoneByPlayer(opponent, transferred.color))

        const matchingAchievements = game
          .getCardsByZone(opponent, 'achievements')
          .filter(card => card.getAge() === transferred.getAge())

        if (matchingAchievements.length > 0) {
          const achieveChoices = game
            .getCardsByZone(opponent, 'score')
            .filter(card => card.getAge() === age)
            .filter(card => game.checkAchievementEligibility(player, card))
          game.aChooseAndAchieve(player, achieveChoices)
        }
      }
    }
  ]
  this.echoImpl = (game, player) => {
    game.aDrawAndMeld(player, game.getEffectAge(this, 8))
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
