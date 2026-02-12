module.exports = {
  id: "profiteering-e082",
  name: "Profiteering",
  deck: "minorE",
  number: 82,
  type: "minor",
  cost: {},
  text: "When you play this card, you immediately get 1 food. Each time after you use the \"Day Laborer\" action space, you can exchange 1 building resource for another building resource.",
  onPlay(game, player) {
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food from Profiteering',
      args: { player },
    })
  },
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer') {
      const buildingResources = ['wood', 'clay', 'reed', 'stone']
      const hasResources = buildingResources.filter(r => player[r] >= 1)
      if (hasResources.length === 0) {
        return
      }

      const choices = []
      for (const from of hasResources) {
        for (const to of buildingResources) {
          if (from !== to) {
            choices.push(`Exchange 1 ${from} for 1 ${to}`)
          }
        }
      }
      choices.push('Skip')
      const selection = game.actions.choose(player, choices, {
        title: 'Profiteering',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        const parts = selection[0].split(' ')
        const fromRes = parts[2]
        const toRes = parts[5]
        player.payCost({ [fromRes]: 1 })
        player.addResource(toRes, 1)
        game.log.add({
          template: '{player} exchanges 1 {from} for 1 {to} using {card}',
          args: { player, from: fromRes, to: toRes, card: this },
        })
      }
    }
  },
}
