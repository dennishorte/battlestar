module.exports = {
  name: `Vaccination`,
  color: `yellow`,
  age: 6,
  expansion: `base`,
  biscuits: `lflh`,
  dogmaBiscuit: `l`,
  dogma: [
    `I demand you choose a card in your score pile! Return all cards from your score pile of its value. If you do, draw and meld a {6}!`,
    `If any card was returned as a result of the demand, draw and meld a {7}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const values = game.getAgesByZone(player, 'score')

      if (values.length === 0) {
        game.log.add({ template: 'no cards in score' })
        return
      }

      const chosenValue = game.aChooseAge(player, values)
      const toReturn = game
        .cards.byPlayer(player, 'score')
        .filter(c => c.getAge() === chosenValue)

      const returned = game.aReturnMany(player, toReturn)

      if (returned.length > 0) {
        game.actions.drawAndMeld(player, game.getEffectAge(self, 6))
        game.state.dogmaInfo.vaccinationCardWasReturned = true
      }
    },
    (game, player, { self }) => {
      if (game.state.dogmaInfo.vaccinationCardWasReturned) {
        game.actions.drawAndMeld(player, game.getEffectAge(self, 7))
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
}
