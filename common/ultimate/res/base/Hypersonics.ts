export default {
  name: `Hypersonics`,
  color: `green`,
  age: 11,
  expansion: `base`,
  biscuits: `iilh`,
  dogmaBiscuit: `i`,
  dogma: [
    `I demand you return exactly two top cards of different colors from your board of the same value! If you do, return all cards of that value or less in your hand and score pile!`
  ],
  dogmaImpl: [
    (game, player) => {
      const valueMap = new Map()

      game.cards.tops(player).forEach(card => {
        const age = card.getAge()
        if (!valueMap.has(age)) {
          valueMap.set(age, [])
        }
        valueMap.get(age).push(card)
      })

      // Find values that have at least 2 cards of different colors
      const validValues = Array
        .from(valueMap.values())
        .filter(x => x.length >= 2)
        .map(x => x[0].getAge())
        .sort()

      if (validValues.length === 0) {
        game.log.add({
          template: '{player} has no valid pairs of cards to return',
          args: { player }
        })
        return
      }

      // Let player choose a value
      const chosenValue = game.actions.chooseAge(player, validValues, {
        title: 'Choose a value to return two cards of'
      })

      // Get cards of that value
      const cardsOfValue = game
        .cards.tops(player)
        .filter(x => x.getAge() === chosenValue)

      const returned = game.actions.chooseAndReturn(player, cardsOfValue, { count: 2, ordered: true })

      if (returned.length === 2) {
        // Return all cards of that value or less from hand and score
        const cardsToReturn = [
          ...game.cards.byPlayer(player, 'hand').filter(c => c.getAge() <= chosenValue),
          ...game.cards.byPlayer(player, 'score').filter(c => c.getAge() <= chosenValue)
        ]

        game.actions.returnMany(player, cardsToReturn, { ordered: true })
      }
    }
  ],
}
