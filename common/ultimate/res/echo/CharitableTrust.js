const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Charitable Trust`  // Card names are unique in Innovation
  this.name = `Charitable Trust`
  this.color = `green`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `&hc3`
  this.dogmaBiscuit = `c`
  this.echo = `Draw a {3} or {4}.`
  this.karma = []
  this.dogma = [
    `You may meld a card from your hand that you drew due to Charitable Trust's echo effect. If you do, either return or achieve (if eligible) your top green card.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      if (!game.state.dogmaInfo.charitableTrust) {
        game.mLog({ template: "Charitable Trust's echo effect was not used." })
        return
      }

      const cards = game.state.dogmaInfo.charitableTrust[player.name]
                        .filter(card => card.zone.includes('hand'))
      const melded = game.aChooseAndMeld(player, cards, { min: 0, max: 1 })[0]

      if (melded) {
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
  ]
  this.echoImpl = (game, player) => {
    const age = game.aChooseAge(player, [game.getEffectAge(this, 3), game.getEffectAge(this, 4)])
    const card = game.aDraw(player, { age })

    if (!game.state.dogmaInfo.charitableTrust) {
      game.state.dogmaInfo.charitableTrust = {}
      game.getPlayerAll().forEach(p => game.state.dogmaInfo.charitableTrust[p.name] = [])
    }

    game.state.dogmaInfo.charitableTrust[player.name].push(card)
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
