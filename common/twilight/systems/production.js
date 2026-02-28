const res = require('../res/index.js')

module.exports = function(Twilight) {

  ////////////////////////////////////////////////////////////////////////////////
  // Production

  Twilight.prototype._productionStep = function(player, systemId) {
    const systemUnits = this.state.units[systemId]
    if (!systemUnits) {
      return
    }

    const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
    if (!tile) {
      return
    }

    const systemPlanets = this._getSystemPlanets(systemId)

    // Find space dock(s) on planets in this system owned by this player
    let hasSpaceDock = false
    let productionCapacity = 0

    for (const planetId of systemPlanets) {
      const planetUnits = systemUnits.planets[planetId] || []
      const docks = planetUnits.filter(
        u => u.owner === player.name && u.type === 'space-dock'
      )
      if (docks.length > 0) {
        hasSpaceDock = true
        const planet = res.getPlanet(planetId)
        const planetResources = planet ? planet.resources : 0
        const dockDef = this._getUnitStats(player.name, 'space-dock')
        const prodValue = dockDef?.productionValue || 2
        productionCapacity += planetResources + prodValue
      }
    }

    // Clan of Saar Floating Factory: space docks may be in the space area
    const spaceDocks = systemUnits.space.filter(
      u => u.owner === player.name && u.type === 'space-dock'
    )
    if (spaceDocks.length > 0) {
      hasSpaceDock = true
      const dockDef = this._getUnitStats(player.name, 'space-dock')
      const prodValue = dockDef?.productionValue || 2
      // Floating factories in space: production = PRODUCTION value only (no planet resources)
      productionCapacity += prodValue * spaceDocks.length
    }

    // Particle Synthesis (Creuss): wormholes in systems with your ships gain PRODUCTION 1
    let wormholeCount = 0
    let hasParticleSynthesis = false
    if (player.hasTechnology('particle-synthesis')) {
      const ownShips = systemUnits.space.filter(u => u.owner === player.name)
      if (ownShips.length > 0) {
        const wormholes = [...(tile.wormholes || [])]
        // Check faction wormholes (Creuss home system has alpha+beta)
        const factionWormholes = this.factionAbilities.getHomeSystemWormholes(systemId)
        for (const w of factionWormholes) {
          if (!wormholes.includes(w)) {
            wormholes.push(w)
          }
        }
        // Check for Creuss wormhole token
        if (this.state.creussWormholeToken === String(systemId)) {
          if (!wormholes.includes('delta')) {
            wormholes.push('delta')
          }
        }
        wormholeCount = wormholes.length
        if (wormholeCount > 0) {
          hasParticleSynthesis = true
          productionCapacity += wormholeCount  // Each wormhole gains PRODUCTION 1
        }
      }
    }

    // Aerie Hololattice (Argent): structures gain PRODUCTION 1
    const structureProdBonus = this.factionAbilities.getStructureProductionBonus(player, systemId)
    const hasStructureProduction = structureProdBonus > 0
    if (hasStructureProduction) {
      productionCapacity += structureProdBonus
    }

    if (!hasSpaceDock && !hasParticleSynthesis && !hasStructureProduction) {
      return
    }

    // Check for blockade (enemy ships in space)
    const enemyShips = systemUnits.space.filter(
      u => u.owner !== player.name && res.getUnit(u.type)?.category === 'ship'
    )
    const isBlockaded = enemyShips.length > 0

    // Ask player what to produce
    const produceSelection = this.actions.choose(player, ['Done'], {
      title: 'Produce Units',
      allowsAction: 'produce-units',
    })

    if (produceSelection.action !== 'produce-units') {
      return
    }

    const requestedUnits = produceSelection.units || []
    if (requestedUnits.length === 0) {
      return
    }

    // Calculate available resources (ready, controlled planets)
    let availableResources = 0
    const controlledPlanets = player.getControlledPlanets()
    const readyPlanets = controlledPlanets.filter(
      pId => !this.state.planets[pId]?.exhausted
    )
    const canSpendFlexibly = this.factionAbilities.canSpendFlexibly(player)
    for (const pId of readyPlanets) {
      const planet = res.getPlanet(pId)
      if (planet) {
        availableResources += planet.resources
        // Archon's Gift: influence counts as resources too
        if (canSpendFlexibly) {
          availableResources += planet.influence
        }
      }
    }
    // Mirror Computing: each trade good is worth 2 resources
    const tgResourceValue = this.factionAbilities.getTradeGoodResourceValue(player)
    availableResources += player.tradeGoods * tgResourceValue

    // Calculate total cost and unit count
    let totalCost = 0
    let totalUnitCount = 0
    const validatedUnits = []

    // Fleet pool tracking
    const currentNonFighters = systemUnits.space
      .filter(u => u.owner === player.name && u.type !== 'fighter')
      .length
    let producedNonFighters = 0
    const fleetLimit = this._getFleetLimit(player)

    // Commander production limit bonuses (e.g., Vuil'raith: up to 2 fighters/infantry free)
    const productionLimitBonusUsed = {}

    for (const req of requestedUnits) {
      const unitDef = this._getUnitStats(player.name, req.type)
      if (!unitDef) {
        continue
      }

      for (let i = 0; i < req.count; i++) {
      // Check blockade: can't produce ships when blockaded
        if (isBlockaded && unitDef.category === 'ship') {
          continue
        }

        // Check fleet pool for non-fighter ships
        if (unitDef.category === 'ship' && unitDef.type !== 'fighter') {
          if (currentNonFighters + producedNonFighters >= fleetLimit) {
            continue
          }
          producedNonFighters++
        }

        // Check production capacity (some units may not count against limit)
        const limitBonus = this.factionAbilities.getProductionLimitBonus(player, unitDef.type)
        const usedBonus = productionLimitBonusUsed[unitDef.type] || 0
        const countsAgainstLimit = usedBonus >= limitBonus

        if (countsAgainstLimit && totalUnitCount >= productionCapacity) {
          break
        }

        if (!countsAgainstLimit) {
          productionLimitBonusUsed[unitDef.type] = usedBonus + 1
        }
        else {
          totalUnitCount++
        }

        // Calculate cost (units with costFor get multiple units per cost payment)
        let unitCost = unitDef.cost
        if (unitDef.costFor > 1 && i % unitDef.costFor !== 0) {
          unitCost = 0
        }

        // Faction cost override (e.g., Nomad commander: flagship costs 0)
        const costOverride = this.factionAbilities.getProductionCostOverride(player, unitDef.type)
        if (costOverride !== null) {
          unitCost = costOverride
        }

        if (totalCost + unitCost > availableResources) {
          break
        }

        totalCost += unitCost
        validatedUnits.push(unitDef)
      }
    }

    // Sarween Tools: reduce cost by 1 (min 0) when producing at least 1 unit
    if (validatedUnits.length > 0 && player.hasTechnology('sarween-tools')) {
      totalCost = Math.max(0, totalCost - 1)
    }

    // Particle Synthesis: reduce cost by 1 for each wormhole in the system
    if (hasParticleSynthesis && validatedUnits.length > 0 && wormholeCount > 0) {
      totalCost = Math.max(0, totalCost - wormholeCount)
    }

    // Create validated units
    for (const unitDef of validatedUnits) {
      if (unitDef.category === 'ship') {
        this._addUnit(systemId, 'space', unitDef.type, player.name)
      }
      else if (unitDef.category === 'ground') {
      // Place on the first planet with a space dock (skip DMZ planets)
        let dockPlanet = systemPlanets.find(pId => {
          if (this._isDemilitarizedZone?.(pId)) {
            return false
          }
          const pu = systemUnits.planets[pId] || []
          return pu.some(u => u.owner === player.name && u.type === 'space-dock')
        })
        // Floating Factory: space dock in space area — place on first controlled planet
        if (!dockPlanet && spaceDocks.length > 0) {
          dockPlanet = systemPlanets.find(pId => {
            if (this._isDemilitarizedZone?.(pId)) {
              return false
            }
            return this.state.planets[pId]?.controller === player.name
          })
        }
        if (dockPlanet) {
          this._addUnit(systemId, dockPlanet, unitDef.type, player.name)
        }
      }
    }

    // Exhaust planets to pay cost, then spend trade goods for remainder
    let remainingCost = totalCost
    for (const pId of readyPlanets) {
      if (remainingCost <= 0) {
        break
      }
      const planet = res.getPlanet(pId)
      if (planet) {
        this.state.planets[pId].exhausted = true
        let planetValue = planet.resources
        // Archon's Gift: influence counts as resources too
        if (canSpendFlexibly) {
          planetValue += planet.influence
        }
        remainingCost -= planetValue
      }
    }
    if (remainingCost > 0) {
    // Mirror Computing: each trade good covers tgResourceValue cost
      const tgNeeded = Math.ceil(remainingCost / tgResourceValue)
      if (player.tradeGoods >= tgNeeded) {
        player.spendTradeGoods(tgNeeded)
        remainingCost = 0
      }
    }

    const totalProduced = validatedUnits.length
    if (totalProduced > 0) {
      this.log.add({
        template: '{player} produces {count} units in system {system}',
        args: { player, count: totalProduced, system: systemId },
      })

      // Faction abilities after production (e.g., Titans of Ul commander Tungstantus)
      this.factionAbilities.afterProduction(player, systemId, totalProduced, validatedUnits)
    }
  }

} // module.exports
