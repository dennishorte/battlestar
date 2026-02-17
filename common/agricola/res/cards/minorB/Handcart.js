module.exports = {
  id: "handcart-b081",
  name: "Handcart",
  deck: "minorB",
  number: 81,
  type: "minor",
  cost: { wood: 1 },
  category: "Building Resource Provider",
  text: "Before the start of each work phase, you can take 1 building resource from a wood/clay/reed/stone accumulation space with at least 6/5/4/4 building resources of the same type. You can only take 1 resource per round.",
  onWorkPhaseStart(game, player) {
    const card = this
    const thresholds = [
      { spaceId: 'take-wood', resource: 'wood', threshold: 6 },
      { spaceId: 'take-clay', resource: 'clay', threshold: 5 },
      { spaceId: 'take-reed', resource: 'reed', threshold: 4 },
      { spaceId: 'take-stone-1', resource: 'stone', threshold: 4 },
      { spaceId: 'take-stone-2', resource: 'stone', threshold: 4 },
    ]

    const available = []
    for (const { spaceId, resource, threshold } of thresholds) {
      const space = game.state.actionSpaces[spaceId]
      if (space && space.accumulated >= threshold) {
        available.push({ spaceId, resource, accumulated: space.accumulated })
      }
    }

    if (available.length === 0) {
      return
    }

    const choices = available.map(a => `Take 1 ${a.resource}`)
    choices.push('Skip')
    const selection = game.actions.choose(player, choices, {
      title: `${card.name}: Take 1 building resource?`,
      min: 1,
      max: 1,
    })

    if (selection[0] !== 'Skip') {
      const idx = choices.indexOf(selection[0])
      const chosen = available[idx]
      game.state.actionSpaces[chosen.spaceId].accumulated -= 1
      player.addResource(chosen.resource, 1)
      game.log.add({
        template: '{player} takes 1 {resource} via {card}',
        args: { player, resource: chosen.resource, card },
      })
    }
  },
}
