module.exports = {
  getExplorationBonus(player, ctx, planetId) {
    const systemId = ctx.game._findSystemForPlanet(planetId)
    if (!systemId) {
      return 0
    }

    const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
    const hasMech = planetUnits.some(u => u.owner === player.name && u.type === 'mech')
    return hasMech ? 1 : 0
  },

  componentActions: [
    {
      id: 'fabrication',
      name: 'Fabrication',
      abilityId: 'fabrication',
      isAvailable: (player) => (player.relicFragments || []).length >= 1,
    },
  ],

  fabrication(ctx, player) {
    const fragments = player.relicFragments || []
    if (fragments.length === 0) {
      return
    }

    const choices = []
    const counts = {}
    for (const f of fragments) {
      counts[f] = (counts[f] || 0) + 1
    }
    const hasPair = Object.values(counts).some(c => c >= 2)

    if (hasPair) {
      choices.push('Purge 2 fragments for relic')
    }
    choices.push('Purge 1 fragment for command token')

    const selection = ctx.actions.choose(player, choices, {
      title: 'Fabrication: Choose action',
    })

    if (selection[0] === 'Purge 1 fragment for command token') {
      const uniqueTypes = [...new Set(fragments)]
      let fragType
      if (uniqueTypes.length === 1) {
        fragType = uniqueTypes[0]
      }
      else {
        const fragSelection = ctx.actions.choose(player, uniqueTypes, {
          title: 'Choose fragment type to purge',
        })
        fragType = fragSelection[0]
      }

      const idx = player.relicFragments.indexOf(fragType)
      if (idx !== -1) {
        player.relicFragments.splice(idx, 1)
      }

      player.commandTokens.tactics += 1

      ctx.log.add({
        template: '{player} purges 1 {type} fragment for 1 command token (Fabrication)',
        args: { player, type: fragType },
      })
    }
    else if (selection[0] === 'Purge 2 fragments for relic') {
      const pairTypes = Object.entries(counts).filter(([, c]) => c >= 2).map(([t]) => t)
      let fragType
      if (pairTypes.length === 1) {
        fragType = pairTypes[0]
      }
      else {
        const fragSelection = ctx.actions.choose(player, pairTypes, {
          title: 'Choose fragment type to purge (2)',
        })
        fragType = fragSelection[0]
      }

      for (let i = 0; i < 2; i++) {
        const idx = player.relicFragments.indexOf(fragType)
        if (idx !== -1) {
          player.relicFragments.splice(idx, 1)
        }
      }

      ctx.log.add({
        template: '{player} purges 2 {type} fragments for a relic (Fabrication)',
        args: { player, type: fragType },
      })
    }
  },
}
