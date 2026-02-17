module.exports = {
  id: "loppers-a034",
  name: "Loppers",
  deck: "minorA",
  number: 34,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { occupations: 2 },
  category: "Points Provider",
  text: "Each time you build 1 or more fences, you can also use this card to exchange 1 wood and 1 fence in your supply for 2 food and 1 bonus point.",
  onBuildFences(game, player) {
    if (player.wood >= 1 && player.getFencesInSupply() >= 1) {
      const card = this
      const choices = [
        'Exchange 1 wood and 1 fence for 2 food and 1 bonus point',
        'Skip',
      ]
      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Exchange wood and fence for food and bonus point?`,
        min: 1,
        max: 1,
      })

      if (selection[0] !== 'Skip') {
        player.payCost({ wood: 1 })
        player.useFenceFromSupply(1)
        player.addResource('food', 2)
        player.addBonusPoints(1)
        game.log.add({
          template: '{player} exchanges 1 wood and 1 fence for 2 food and 1 bonus point using {card}',
          args: { player, card },
        })
      }
    }
  },
}
