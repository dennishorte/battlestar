module.exports = {
  name: `Encyclopedia`,
  color: `blue`,
  age: 6,
  expansion: `base`,
  biscuits: `hccc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Choose a value. You may meld all the cards of that value in your score pile.`,
    `You may junk an available achievement of value 5, 6, or 7.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const values = game.getAgesByZone(player, 'score')

      if (values.length === 0) {
        game.log.add({ template: 'no cards in score' })
        return
      }

      const chosenValue = game.actions.chooseAge(player, values, {
        title: 'Choose an age to merge from your score',
        min: 0,
      })
      if (chosenValue) {
        const toMeld = game
          .cards.byPlayer(player, 'score')
          .filter(c => c.getAge() === chosenValue)
        game.actions.meldMany(player, toMeld)
      }
    },

    (game, player) => {
      game.actions.junkAvailableAchievement(player, [5, 6, 7], { min: 0 })
    },
  ],
}
