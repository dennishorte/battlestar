module.exports = {
  id: `Tecumseh`,  // Card names are unique in Innovation
  name: `Tecumseh`,
  color: `red`,
  age: 6,
  expansion: `figs`,
  biscuits: `fhpf`,
  dogmaBiscuit: `f`,
  karma: [
    `If you would meld a card, first choose a value. Return a top card with {f} of the chosen value from each player's board. Junk an available achievement of the chosen value.`,
  ],
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const value = game.actions.chooseAge(player)
        const choices = game
          .players
          .all()
          .map(player => {
            const cards = game
              .cards
              .tops(player)
              .filter(card => card.getAge() === value)
              .filter(card => card.checkHasBiscuit('f'))

            return {
              title: player.name,
              id: player.name,
              choices: cards.map(card => game.actions.cardOption(card)),
              count: 1,
            }
          })
          .filter(({ choices }) => choices.length > 0)

        const chosen = game.actions.choose(player, choices, {
          title: 'Choose a card to return for each player',
          count: choices.length
        })

        const toReturn = chosen.map(selection => {
          const inner = selection.selection[0]
          const cardId = (inner && typeof inner === 'object') ? inner.id : inner
          return game.cards.byId(cardId)
        })
        game.actions.returnMany(player, toReturn)

        game.actions.junkAvailableAchievement(player, value)
      }
    }
  ]
}
