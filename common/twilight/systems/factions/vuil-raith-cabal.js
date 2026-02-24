module.exports = {
  onUnitDestroyed(player, ctx, { systemId: _systemId, unit }) {
    const unitDef = ctx.game.res.getUnit(unit.type)
    if (!unitDef || unitDef.category === 'structure') {
      return
    }

    // Devour only captures opponent's units, not your own
    if (unit.owner === player.name) {
      return
    }

    if (!ctx.state.capturedUnits[player.name]) {
      ctx.state.capturedUnits[player.name] = []
    }

    ctx.state.capturedUnits[player.name].push({
      type: unit.type,
      originalOwner: unit.owner,
    })

    ctx.log.add({
      template: '{player} captures {type} from {owner} (Devour)',
      args: { player, type: unit.type, owner: unit.owner },
    })
  },

  componentActions: [
    {
      id: 'amalgamation',
      name: 'Amalgamation',
      abilityId: 'amalgamation',
      isAvailable(player) {
        return (this?._game?.state?.capturedUnits?.[player.name] || []).length > 0
      },
    },
    {
      id: 'riftmeld',
      name: 'Riftmeld',
      abilityId: 'riftmeld',
      isAvailable(player) {
        return (this?._game?.state?.capturedUnits?.[player.name] || []).length > 0
      },
    },
  ],

  amalgamation(ctx, player) {
    const captured = ctx.state.capturedUnits[player.name] || []
    if (captured.length === 0) {
      return
    }

    const choices = captured.map(c => `${c.type} (from ${c.originalOwner})`)
    const selection = ctx.actions.choose(player, choices, {
      title: 'Amalgamation: Choose captured unit to return',
    })

    const idx = choices.indexOf(selection[0])
    if (idx === -1) {
      return
    }

    const removed = captured.splice(idx, 1)[0]

    const validSystems = []
    for (const [sysId, sysUnits] of Object.entries(ctx.state.units)) {
      if (sysUnits.space.some(u => u.owner === player.name)) {
        validSystems.push(sysId)
      }
    }

    if (validSystems.length === 0) {
      return
    }

    let targetSystem
    if (validSystems.length === 1) {
      targetSystem = validSystems[0]
    }
    else {
      const sysSelection = ctx.actions.choose(player, validSystems, {
        title: 'Choose system to place unit',
      })
      targetSystem = sysSelection[0]
    }

    ctx.game._addUnit(targetSystem, 'space', removed.type, player.name)

    ctx.log.add({
      template: '{player} uses Amalgamation: places {type} in system {system}',
      args: { player, type: removed.type, system: targetSystem },
    })
  },

  riftmeld(ctx, player) {
    const captured = ctx.state.capturedUnits[player.name] || []
    if (captured.length === 0) {
      return
    }

    const choices = captured.map(c => `${c.type} (from ${c.originalOwner})`)
    const selection = ctx.actions.choose(player, choices, {
      title: 'Riftmeld: Choose captured unit to return',
    })

    const idx = choices.indexOf(selection[0])
    if (idx === -1) {
      return
    }

    captured.splice(idx, 1)

    const allTechs = [...ctx.game.res.getGenericTechnologies()]
    if (player.faction?.factionTechnologies) {
      allTechs.push(...player.faction.factionTechnologies)
    }
    const unitUpgrades = allTechs
      .filter(t => t.unitUpgrade && !player.hasTechnology(t.id))
      .map(t => t.id)

    if (unitUpgrades.length === 0) {
      return
    }

    const techSelection = ctx.actions.choose(player, unitUpgrades, {
      title: 'Riftmeld: Research unit upgrade (ignoring prerequisites)',
    })

    const techId = techSelection[0]
    ctx.game._grantTechnology(player, techId)

    ctx.log.add({
      template: '{player} uses Riftmeld: researches {tech}',
      args: { player, tech: techId },
    })
  },
}
