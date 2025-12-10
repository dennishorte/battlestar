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
              choices: cards.map(card => card.id),
              count: 1,
            }
          })
          .filter(({ choices }) => choices.length > 0)

        const chosen = game.actions.choose(player, choices, {
          title: 'Choose a card to return for each player',
          count: choices.length
        })

        const toReturn = chosen.map(selection => game.cards.byId(selection.selection[0]))
        game.actions.returnMany(player, toReturn)

        game.actions.junkAvailableAchievement(player, value)
      }
    }
  ]
}
