module.exports = {
  name: `Charitable Trust`,
  color: `green`,
  age: 3,
  expansion: `echo`,
  biscuits: `&hc3`,
  dogmaBiscuit: `c`,
  echo: `Draw a {3} or {4}.`,
  dogma: [
    `You may meld a card from your hand that you drew due to Charitable Trust's echo effect. If you meld a {3}, achieve your top green card (if eligible). If you meld a {4}, return your top green card.`
  ],
  dogmaImpl: [
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

        if (!greenCard) {
          game.mLog({ template: 'no top green card' })
        }
        else if (melded.getAge() === game.getEffectAge(this, 3)) {
          if (game.checkAchievementEligibility(player, greenCard)) {
            game.aClaimAchievement(player, { card: greenCard })
          }
        }
        else if (melded.getAge() === game.getEffectAge(this, 4)) {
          game.aReturn(player, greenCard)
        }
      }
    }
  ],
  echoImpl: (game, player) => {
    const age = game.aChooseAge(player, [game.getEffectAge(this, 3), game.getEffectAge(this, 4)])
    const card = game.aDraw(player, { age })

    if (!game.state.dogmaInfo.charitableTrust) {
      game.state.dogmaInfo.charitableTrust = {}
      game.getPlayerAll().forEach(p => game.state.dogmaInfo.charitableTrust[p.name] = [])
    }

    game.state.dogmaInfo.charitableTrust[player.name].push(card)
  },
}
