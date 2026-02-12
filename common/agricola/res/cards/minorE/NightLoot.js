module.exports = {
  id: "night-loot-e005",
  name: "Night Loot",
  deck: "minorE",
  number: 5,
  type: "minor",
  cost: { food: 2 },
  text: "Immediately remove exactly 2 different building resources from accumulation spaces and place them in your supply.",
  onPlay(game, player) {
    const buildingResources = ['wood', 'clay', 'reed', 'stone']

    // Find accumulation spaces with building resources
    const availableByType = {}
    for (const actionId of game.state.activeActions) {
      const action = game.getActionById(actionId)
      if (!action || !action.accumulates) {
        continue
      }
      const actionState = game.state.actionSpaces[actionId]
      if (!actionState || actionState.accumulated <= 0) {
        continue
      }

      for (const resource of Object.keys(action.accumulates)) {
        if (buildingResources.includes(resource)) {
          if (!availableByType[resource]) {
            availableByType[resource] = []
          }
          availableByType[resource].push({ actionId, name: action.name })
        }
      }
    }

    const availableTypes = Object.keys(availableByType)
    if (availableTypes.length < 2) {
      return
    }

    // Pick first resource type
    const selection1 = game.actions.choose(player, availableTypes, {
      title: 'Night Loot: Choose 1st building resource',
      min: 1,
      max: 1,
    })
    const type1 = selection1[0]

    // Take 1 from an accumulation space of that type
    const takeFrom = (type) => {
      const spaces = availableByType[type].filter(
        s => game.state.actionSpaces[s.actionId].accumulated > 0
      )
      if (spaces.length === 0) {
        return
      }
      let space
      if (spaces.length === 1) {
        space = spaces[0]
      }
      else {
        const choices = spaces.map(s => s.name)
        const sel = game.actions.choose(player, choices, {
          title: `Night Loot: Choose ${type} source`,
          min: 1,
          max: 1,
        })
        space = spaces[choices.indexOf(sel[0])]
      }
      game.state.actionSpaces[space.actionId].accumulated--
      player.addResource(type, 1)
    }

    takeFrom(type1)

    // Pick second resource type (must be different)
    const remainingTypes = availableTypes.filter(
      t => t !== type1 &&
      availableByType[t].some(s => game.state.actionSpaces[s.actionId].accumulated > 0)
    )
    if (remainingTypes.length === 0) {
      return
    }

    let type2
    if (remainingTypes.length === 1) {
      type2 = remainingTypes[0]
    }
    else {
      const selection2 = game.actions.choose(player, remainingTypes, {
        title: 'Night Loot: Choose 2nd building resource',
        min: 1,
        max: 1,
      })
      type2 = selection2[0]
    }

    takeFrom(type2)

    game.log.add({
      template: '{player} takes 1 {res1} and 1 {res2} using {card}',
      args: { player, res1: type1, res2: type2, card: this },
    })
  },
}
