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
  onAction(game, player) {
    const card = this
    const buildingSpaces = ['take-wood', 'take-clay', 'take-reed', 'take-stone']
    const available = []
    for (const spaceId of buildingSpaces) {
      const space = game.state.actionSpaces[spaceId]
      if (space && space.accumulated >= 4) {
        const resource = spaceId.replace('take-', '')
        available.push(`Take 1 ${resource} (${space.accumulated} available)`)
      }
    }

    if (available.length === 0) {
      return
    }

    available.push('Skip')
    const selection = game.actions.choose(player, available, {
      title: `${card.name}: Take 1 building resource?`,
      min: 1,
      max: 1,
    })

    if (selection[0] !== 'Skip') {
      const match = selection[0].match(/Take 1 (\w+)/)
      if (match) {
        const resource = match[1]
        const spaceId = `take-${resource}`
        game.state.actionSpaces[spaceId].accumulated -= 1
        player.addResource(resource, 1)
        game.log.add({
          template: '{player} takes 1 {resource} using {card}',
          args: { player, resource, card },
        })
      }
    }
  },
}
