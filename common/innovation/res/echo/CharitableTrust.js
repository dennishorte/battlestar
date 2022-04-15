const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Charitable Trust`  // Card names are unique in Innovation
  this.name = `Charitable Trust`
  this.color = `green`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `&hc3`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `Draw a {3} or {4}.`
  this.karma = []
  this.dogma = [
    `You may meld the card you drew due to Charitable Trust's echo effect. If you do, either return or achieve (if eligible) your top green card.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.state.dogmaInfo.charitableTrust[player.name]
      if (card) {
        const meldIt = game.aYesNo(player, `Meld ${card.name}?`)
        if (meldIt) {
          game.aMeld(player, card)

          const greenCard = game.getTopCard(player, 'green')
          if (greenCard) {
            if (game.checkAchievementEligibility(player, greenCard)) {
              game.aClaimAchievement(player, { card: greenCard })
            }
            else {
              game.aReturn(player, greenCard)
            }
          }
        }
      }
    }
  ]
  this.echoImpl = (game, player) => {
    const age = game.aChooseAge(player, [game.getEffectAge(this, 3), game.getEffectAge(this, 4)])
    const card = game.aDraw(player, { age })

    if (!game.state.dogmaInfo.charitableTrust) {
      game.state.dogmaInfo.charitableTrust = {}
    }

    game.state.dogmaInfo.charitableTrust[player.name] = card
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
