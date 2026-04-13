module.exports = {
  id: "work-certificate-a082",
  name: "Work Certificate",
  deck: "minorA",
  number: 82,
  type: "minor",
  cost: {},
  prereqs: { occupations: 3 },
  category: "Building Resource Provider",
  text: "Each time after you use an action space, you can take 1 building resource from a building resource accumulation space with at least 4 building resources on it.",
  matches_onAction() {
    return true
  },
  onAction(game, player) {
    const card = this
    const buildingResources = ['wood', 'clay', 'reed', 'stone']
    const spaces = []

    for (const actionId of game.state.activeActions) {
      const action = game.getActionById(actionId)
      if (!action || !action.accumulates) {
        continue
      }
      const actionState = game.state.actionSpaces[actionId]
      if (!actionState || actionState.accumulated < 4) {
        continue
      }
      for (const resource of Object.keys(action.accumulates)) {
        if (buildingResources.includes(resource)) {
          spaces.push({ actionId, name: action.name, resource })
        }
      }
    }

    if (spaces.length === 0) {
      return
    }

    const choices = spaces.map(s => {
      const acc = game.state.actionSpaces[s.actionId].accumulated
      return `Take 1 ${s.resource} from ${s.name} (${acc} available)`
    })
    choices.push('Skip')

    const selection = game.actions.choose(player, choices, {
      title: `${card.name}: Take 1 building resource?`,
      min: 1,
      max: 1,
    })

    if (selection[0] !== 'Skip') {
      const idx = choices.indexOf(selection[0])
      const space = spaces[idx]
      game.state.actionSpaces[space.actionId].accumulated -= 1
      player.addResource(space.resource, 1)
      game.log.add({
        template: '{player} takes 1 {resource}',
        args: { player, resource: space.resource },
      })
    }
  },
}
