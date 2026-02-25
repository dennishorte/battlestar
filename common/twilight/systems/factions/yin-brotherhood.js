module.exports = {
  componentActions: [
    {
      id: 'yin-hero',
      name: 'Dannel of the Tenth (Quantum Dissemination)',
      abilityId: 'indoctrination',  // reuse faction ability ID for availability gate
      isAvailable: function(player) {
        return player.isHeroUnlocked() && !player.isHeroPurged()
      },
    },
  ],

  // ---------------------------------------------------------------------------
  // Hero — Dannel of the Tenth: QUANTUM DISSEMINATION
  // ACTION: Commit up to 3 infantry from reinforcements to non-home planets
  // you do not control. Resolve ground combats without space cannon. Purge.
  // ---------------------------------------------------------------------------

  yinHero(ctx, player) {
    const res = ctx.game.res

    // Find non-home, enemy-controlled planets
    const eligiblePlanets = []
    for (const [planetId, planetState] of Object.entries(ctx.state.planets)) {
      if (!planetState.controller || planetState.controller === player.name) {
        continue
      }
      const planet = res.getPlanet(planetId)
      if (!planet) {
        continue
      }
      // Exclude home system planets
      const systemId = planet.systemId || ctx.game._findSystemForPlanet(planetId)
      if (!systemId) {
        continue
      }
      const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
      if (tile?.type === 'home') {
        continue
      }
      eligiblePlanets.push({ planetId, systemId })
    }

    if (eligiblePlanets.length === 0) {
      player.purgeHero()
      ctx.log.add({
        template: '{player} purges Dannel of the Tenth but no eligible planets',
        args: { player: player.name },
      })
      return
    }

    // Choose up to 3 planets
    const chosenPlanets = []
    const available = [...eligiblePlanets]
    for (let i = 0; i < 3 && available.length > 0; i++) {
      const choices = [...available.map(p => p.planetId), 'Done']
      const selection = ctx.actions.choose(player, choices, {
        title: `Quantum Dissemination: Choose planet ${i + 1}/3 (or Done)`,
      })
      if (selection[0] === 'Done') {
        break
      }
      const target = available.find(p => p.planetId === selection[0])
      chosenPlanets.push(target)
      // Remove from available so can't choose same planet twice
      const idx = available.indexOf(target)
      available.splice(idx, 1)
    }

    if (chosenPlanets.length === 0) {
      player.purgeHero()
      ctx.log.add({
        template: '{player} purges Dannel of the Tenth without committing infantry',
        args: { player: player.name },
      })
      return
    }

    // Commit 1 infantry to each chosen planet and resolve ground combat
    for (const { planetId, systemId } of chosenPlanets) {
      ctx.game._addUnitToPlanet(systemId, planetId, 'infantry', player.name)

      ctx.log.add({
        template: 'Quantum Dissemination: {player} commits 1 infantry to {planet}',
        args: { player: player.name, planet: planetId },
      })

      // Resolve ground combat (no space cannon, no bombardment)
      ctx.game._groundCombat(systemId, planetId, player.name)

      // Establish control if the planet was won
      ctx.game._establishControl(systemId, planetId, player.name, {})
    }

    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Dannel of the Tenth',
      args: { player: player.name },
    })
  },

  // Impulse Core (faction tech): At start of space combat, may destroy own
  // cruiser or destroyer to produce 1 hit against a non-fighter ship.
  onSpaceCombatStart(player, ctx, { systemId, opponentName }) {
    if (!player.hasTechnology('impulse-core')) {
      return
    }

    const systemUnits = ctx.state.units[systemId]

    const sacrificeShips = systemUnits.space
      .filter(u => u.owner === player.name && (u.type === 'cruiser' || u.type === 'destroyer'))

    if (sacrificeShips.length === 0) {
      return
    }

    // Must have non-fighter enemy ships to target
    const enemyNonFighters = systemUnits.space
      .filter(u => u.owner === opponentName && u.type !== 'fighter')
    if (enemyNonFighters.length === 0) {
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
      title: 'Impulse Core: Destroy a ship to produce 1 hit against a non-fighter?',
    })

    if (selection[0] === 'Pass') {
      return
    }

    // Destroy the sacrificed ship
    const shipType = selection[0] === 'Destroy cruiser' ? 'cruiser' : 'destroyer'
    const shipIdx = systemUnits.space.findIndex(u => u.owner === player.name && u.type === shipType)
    if (shipIdx !== -1) {
      systemUnits.space.splice(shipIdx, 1)
    }

    // Destroy cheapest non-fighter enemy ship
    const targetShips = systemUnits.space
      .filter(u => u.owner === opponentName && u.type !== 'fighter')
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
      template: 'Impulse Core: {player} destroys {ship} to produce 1 hit against non-fighter',
      args: { player, ship: shipType },
    })
  },

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

  // Commander — Brother Omar: Satisfies 1 green technology prerequisite.
  // When researching a tech owned by another player, may return 1 infantry
  // to a planet you control to ignore all prerequisites.
  getTechPrerequisiteBonuses(player, _ctx) {
    if (!player.isCommanderUnlocked()) {
      return {}
    }
    return { green: 1 }
  },

  // Find techs owned by other players that Yin doesn't have and can't normally research
  getAdditionalResearchableTechs(player, ctx, allTechs) {
    if (!player.isCommanderUnlocked()) {
      return []
    }

    // Check if player has any infantry on controlled planets
    const controlledPlanets = player.getControlledPlanets()
    let hasInfantry = false
    for (const planetId of controlledPlanets) {
      const systemId = ctx.game._findSystemForPlanet(planetId)
      if (!systemId) {
        continue
      }
      const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
      if (planetUnits.some(u => u.owner === player.name && u.type === 'infantry')) {
        hasInfantry = true
        break
      }
    }

    if (!hasInfantry) {
      return []
    }

    // Find techs owned by at least one other player
    const otherPlayers = ctx.players.all().filter(p => p.name !== player.name)
    const otherTechIds = new Set()
    for (const other of otherPlayers) {
      for (const techId of other.getTechIds()) {
        otherTechIds.add(techId)
      }
    }

    // Return techs the player doesn't have, that are owned by another player,
    // and that the player can't already research normally
    return allTechs
      .filter(t =>
        !player.hasTechnology(t.id)
        && otherTechIds.has(t.id)
        && !player.canResearchTechnology(t.id)
      )
      .map(t => t.id)
  },

  // When the selected tech is one that required the infantry sacrifice, handle it
  onPreResearch(player, ctx, tech) {
    if (!player.isCommanderUnlocked()) {
      return
    }

    // Check if this tech could be researched normally (with commander green bonus already applied)
    if (player.canResearchTechnology(tech.id)) {
      return
    }

    // This tech requires the infantry sacrifice — check if another player owns it
    const otherPlayers = ctx.players.all().filter(p => p.name !== player.name)
    const ownedByOther = otherPlayers.some(p => p.hasTechnology(tech.id))
    if (!ownedByOther) {
      return
    }

    // Find planets with infantry to sacrifice
    const controlledPlanets = player.getControlledPlanets()
    const planetsWithInfantry = []
    for (const planetId of controlledPlanets) {
      const systemId = ctx.game._findSystemForPlanet(planetId)
      if (!systemId) {
        continue
      }
      const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
      if (planetUnits.some(u => u.owner === player.name && u.type === 'infantry')) {
        planetsWithInfantry.push({ planetId, systemId })
      }
    }

    if (planetsWithInfantry.length === 0) {
      return
    }

    // Choose planet to return infantry from
    let target
    if (planetsWithInfantry.length === 1) {
      target = planetsWithInfantry[0]
    }
    else {
      const planetChoices = planetsWithInfantry.map(p => p.planetId)
      const selection = ctx.actions.choose(player, planetChoices, {
        title: 'Brother Omar: Return 1 infantry from which planet?',
      })
      target = planetsWithInfantry.find(p => p.planetId === selection[0])
    }

    // Remove 1 infantry from the planet
    const planetUnits = ctx.state.units[target.systemId].planets[target.planetId]
    const idx = planetUnits.findIndex(u => u.owner === player.name && u.type === 'infantry')
    if (idx !== -1) {
      planetUnits.splice(idx, 1)
    }

    ctx.log.add({
      template: 'Brother Omar: {player} returns 1 infantry from {planet} to ignore prerequisites',
      args: { player: player.name, planet: target.planetId },
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

    // Mech DEPLOY — Moyin's Ashes: when using Indoctrination, spend 1 additional
    // influence to replace with mech instead of infantry
    let deployMech = false
    if (player.getTotalInfluence() >= 3) {
      const mechChoice = ctx.actions.choose(player, ['Deploy Mech (+1 influence)', 'Infantry only'], {
        title: "Moyin's Ashes: Spend 1 extra influence to deploy mech instead of infantry?",
      })
      if (mechChoice[0] === 'Deploy Mech (+1 influence)') {
        deployMech = true
      }
    }

    ctx.game._payInfluence(player, deployMech ? 3 : 2)

    const idx = planetUnits.findIndex(u => u.owner === opponentName && u.type === 'infantry')
    if (idx !== -1) {
      planetUnits.splice(idx, 1)
    }

    const unitType = deployMech ? 'mech' : 'infantry'
    ctx.game._addUnitToPlanet(systemId, planetId, unitType, player.name)

    if (deployMech) {
      ctx.log.add({
        template: "Moyin's Ashes: {player} uses Indoctrination to deploy mech (replaces 1 enemy infantry)",
        args: { player },
      })
    }
    else {
      ctx.log.add({
        template: '{player} uses Indoctrination: replaces 1 enemy infantry',
        args: { player },
      })
    }
  },

  // Yin Ascendant: when gained or when scoring a public objective,
  // gain the alliance ability of a random, unused faction.
  onTechResearched(player, ctx, tech) {
    if (tech.id !== 'yin-ascendant') {
      return
    }
    this._grantRandomAlliance(player, ctx)
  },

  onObjectiveScored(player, ctx) {
    if (!player.hasTechnology('yin-ascendant')) {
      return
    }
    this._grantRandomAlliance(player, ctx)
  },

  _grantRandomAlliance(player, ctx) {
    if (!ctx.state.yinAscendantAlliances) {
      ctx.state.yinAscendantAlliances = []
    }

    // Get all faction IDs not in the game and not already granted
    const res = require('../../res')
    const allFactions = res.getAllFactionIds()
    const inGameFactions = ctx.players.all().map(p => p.faction?.id).filter(Boolean)
    const grantedFactions = ctx.state.yinAscendantAlliances

    const available = allFactions.filter(
      fId => !inGameFactions.includes(fId) && !grantedFactions.includes(fId)
    )

    if (available.length === 0) {
      return
    }

    // Random pick
    const idx = Math.floor(ctx.game.random() * available.length)
    const factionId = available[idx]
    ctx.state.yinAscendantAlliances.push(factionId)

    ctx.log.add({
      template: 'Yin Ascendant: {player} gains alliance ability of {faction}',
      args: { player: player.name, faction: factionId },
    })
  },

  // Yin Spinner (faction tech): After you produce units, place up to 2 infantry
  // from your reinforcements on any planet you control or in any space area
  // that contains 1 or more of your ships.
  afterProduction(player, ctx, { systemId: _systemId }) {
    if (!player.hasTechnology('yin-spinner')) {
      return
    }

    // Find valid placement locations
    const placements = []

    // Controlled planets
    const controlledPlanets = player.getControlledPlanets()
    for (const planetId of controlledPlanets) {
      placements.push({ type: 'planet', planetId })
    }

    // Space areas with own ships
    for (const [sysId, systemUnits] of Object.entries(ctx.state.units)) {
      const hasShips = systemUnits.space.some(u => u.owner === player.name)
      if (hasShips) {
        placements.push({ type: 'space', systemId: sysId })
      }
    }

    if (placements.length === 0) {
      return
    }

    const choices = [
      'Pass',
      ...placements.map(p =>
        p.type === 'planet' ? `Planet: ${p.planetId}` : `Space: system ${p.systemId}`
      ),
    ]

    let placed = 0
    while (placed < 2) {
      const remaining = 2 - placed
      const selection = ctx.actions.choose(player, choices, {
        title: `Yin Spinner: Place infantry (${remaining} remaining)`,
      })

      if (selection[0] === 'Pass') {
        break
      }

      const idx = choices.indexOf(selection[0])
      const target = placements[idx - 1]  // -1 for 'Pass' offset

      if (target.type === 'planet') {
        const sysId = ctx.game._findSystemForPlanet(target.planetId)
        if (sysId) {
          ctx.game._addUnit(sysId, target.planetId, 'infantry', player.name)
        }
      }
      else {
        ctx.game._addUnit(target.systemId, 'space', 'infantry', player.name)
      }

      placed++
    }

    if (placed > 0) {
      ctx.log.add({
        template: 'Yin Spinner: {player} places {count} infantry',
        args: { player: player.name, count: placed },
      })
    }
  },
}
