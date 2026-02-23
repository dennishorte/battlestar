module.exports = {
  afterSpaceCombatRound(player, ctx, { systemId, opponentName }) {
    const systemUnits = ctx.state.units[systemId]

    const sacrificeShips = systemUnits.space
      .filter(u => u.owner === player.name && (u.type === 'cruiser' || u.type === 'destroyer'))

    if (sacrificeShips.length === 0) {
      return
    }

    const enemyShips = systemUnits.space.filter(u => u.owner === opponentName)
    if (enemyShips.length === 0) {
      return
    }

    const choices = ['Pass']
    const cruisers = sacrificeShips.filter(u => u.type === 'cruiser')
    const destroyers = sacrificeShips.filter(u => u.type === 'destroyer')
    if (destroyers.length > 0) {
      choices.unshift('Destroy destroyer')
    }
    if (cruisers.length > 0) {
      choices.unshift('Destroy cruiser')
    }

    const selection = ctx.actions.choose(player, choices, {
      title: 'Devotion: Destroy a ship to produce 1 hit?',
    })

    if (selection[0] === 'Pass') {
      return
    }

    const shipType = selection[0] === 'Destroy cruiser' ? 'cruiser' : 'destroyer'
    const shipIdx = systemUnits.space.findIndex(u => u.owner === player.name && u.type === shipType)
    if (shipIdx !== -1) {
      systemUnits.space.splice(shipIdx, 1)
    }

    const targetShips = systemUnits.space
      .filter(u => u.owner === opponentName)
      .sort((a, b) => {
        const defA = ctx.game._getUnitStats(a.owner, a.type)
        const defB = ctx.game._getUnitStats(b.owner, b.type)
        return (defA?.cost || 0) - (defB?.cost || 0)
      })

    if (targetShips.length > 0) {
      const toDestroy = targetShips[0]
      const idx = systemUnits.space.indexOf(toDestroy)
      if (idx !== -1) {
        systemUnits.space.splice(idx, 1)
      }
    }

    ctx.log.add({
      template: '{player} uses Devotion: destroys {ship} to produce 1 hit',
      args: { player, ship: shipType },
    })
  },

  // Agent — Brother Milor: After a player's unit is destroyed during combat,
  // exhaust to place 2 fighters (if ship) or 2 infantry (if ground force) for that player
  onAnyUnitDestroyed(player, ctx, { systemId, unit, planetId }) {
    if (!player.isAgentReady()) {
      return
    }

    const unitDef = ctx.game.res.getUnit(unit.type)
    if (!unitDef || unitDef.category === 'structure') {
      return
    }

    const isShip = unitDef.category === 'ship'
    const unitLabel = isShip ? '2 fighters' : '2 infantry'

    const choice = ctx.actions.choose(player, ['Exhaust Brother Milor', 'Pass'], {
      title: `Brother Milor: Exhaust to place ${unitLabel} for ${unit.owner}?`,
    })

    if (choice[0] === 'Pass') {
      return
    }

    player.exhaustAgent()

    if (isShip) {
      for (let i = 0; i < 2; i++) {
        ctx.game._addUnit(systemId, 'space', 'fighter', unit.owner)
      }
    }
    else {
      for (let i = 0; i < 2; i++) {
        ctx.game._addUnit(systemId, planetId, 'infantry', unit.owner)
      }
    }

    ctx.log.add({
      template: 'Brother Milor: {player} places {units} for {target} in system {system}',
      args: { player: player.name, units: unitLabel, target: unit.owner, system: systemId },
    })
  },

  onGroundCombatStart(player, ctx, { systemId, planetId, opponentName }) {
    const planetUnits = ctx.state.units[systemId].planets[planetId]

    const enemyInfantry = planetUnits.filter(u => u.owner === opponentName && u.type === 'infantry')
    if (enemyInfantry.length === 0) {
      return
    }

    if (player.getTotalInfluence() < 2) {
      return
    }

    const choice = ctx.actions.choose(player, ['Indoctrinate', 'Pass'], {
      title: 'Indoctrination: Spend 2 influence to replace 1 enemy infantry?',
    })

    if (choice[0] === 'Pass') {
      return
    }

    ctx.game._payInfluence(player, 2)

    const idx = planetUnits.findIndex(u => u.owner === opponentName && u.type === 'infantry')
    if (idx !== -1) {
      planetUnits.splice(idx, 1)
    }

    ctx.game._addUnitToPlanet(systemId, planetId, 'infantry', player.name)

    ctx.log.add({
      template: '{player} uses Indoctrination: replaces 1 enemy infantry',
      args: { player },
    })
  },
}
