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

  // Commander — Dart and Tai: After you gain control of a planet that was
  // controlled by another player, you may explore that planet.
  onPlanetGained(player, ctx, { planetId, previousController }) {
    if (!player.isCommanderUnlocked()) {
      return
    }

    // Only triggers when taking a planet from another player
    if (!previousController || previousController === player.name) {
      return
    }

    // Check if the planet has a trait (explorable)
    const planet = ctx.game.res.getPlanet(planetId)
    if (!planet || !planet.trait) {
      return
    }

    // Check if already explored
    if (ctx.state.exploredPlanets[planetId]) {
      return
    }

    const choice = ctx.actions.choose(player, ['Explore', 'Pass'], {
      title: `Dart and Tai: Explore ${planetId}?`,
    })

    if (choice[0] === 'Explore') {
      ctx.game._explorePlanet(planetId, player.name)

      ctx.log.add({
        template: 'Dart and Tai: {player} explores {planet}',
        args: { player: player.name, planet: planetId },
      })
    }
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

  // Agent — Garv and Gunn: At the end of a player's tactical action, exhaust
  // to allow that player to explore 1 planet they control in the active system.
  onTacticalActionEnd(naazRokhaPlayer, ctx, { activatingPlayer, systemId }) {
    if (!naazRokhaPlayer.isAgentReady()) {
      return
    }

    // Find planets in the active system controlled by the activating player
    const tile = ctx.game.res.getSystemTile(systemId) || ctx.game.res.getSystemTile(Number(systemId))
    if (!tile || tile.planets.length === 0) {
      return
    }

    // Only consider unexplored planets with traits that the activating player controls
    const explorablePlanets = tile.planets.filter(planetId => {
      const planet = ctx.game.res.getPlanet(planetId)
      if (!planet || !planet.trait) {
        return false
      }
      if (ctx.state.exploredPlanets[planetId]) {
        return false
      }
      const planetState = ctx.state.planets[planetId]
      return planetState?.controller === activatingPlayer.name
    })

    if (explorablePlanets.length === 0) {
      return
    }

    const choice = ctx.actions.choose(naazRokhaPlayer, ['Exhaust Garv and Gunn', 'Pass'], {
      title: `Garv and Gunn: Exhaust to let ${activatingPlayer.name} explore a planet in the active system?`,
    })

    if (choice[0] !== 'Exhaust Garv and Gunn') {
      return
    }

    naazRokhaPlayer.exhaustAgent()

    // Choose which planet to explore
    let targetPlanet
    if (explorablePlanets.length === 1) {
      targetPlanet = explorablePlanets[0]
    }
    else {
      const planetChoice = ctx.actions.choose(naazRokhaPlayer, explorablePlanets, {
        title: 'Garv and Gunn: Choose planet to explore',
      })
      targetPlanet = planetChoice[0]
    }

    ctx.game._explorePlanet(targetPlanet, activatingPlayer.name)

    ctx.log.add({
      template: 'Garv and Gunn: {player} allows {target} to explore {planet}',
      args: { player: naazRokhaPlayer.name, target: activatingPlayer.name, planet: targetPlanet },
    })
  },
}
