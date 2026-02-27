const res = require('../res/index.js')

module.exports = function(Twilight) {

  Twilight.prototype._hasAvailableComponentActions = function(player) {
    const factionActions = this.factionAbilities.getAvailableComponentActions(player)
    if (factionActions.length > 0) {
      return true
    }
    const techActions = this._getTechComponentActions(player)
    if (techActions.length > 0) {
      return true
    }
    const relicActions = this._getRelicComponentActions(player)
    if (relicActions.length > 0) {
      return true
    }
    return this._canPurgeRelicFragments(player)
  }

  Twilight.prototype._componentAction = function(player) {
    this.log.indent()

    // Gather available component actions (faction abilities + technology)
    const actions = this.factionAbilities.getAvailableComponentActions(player)

    // Technology-based component actions
    const techActions = this._getTechComponentActions(player)
    actions.push(...techActions)

    // Relic-based component actions
    const relicActions = this._getRelicComponentActions(player)
    actions.push(...relicActions)

    // General relic fragment purge (3 of same type → 1 relic)
    if (this._canPurgeRelicFragments(player)) {
      actions.push({
        id: 'purge-relic-fragments',
        name: 'Purge Relic Fragments',
      })
    }

    if (actions.length === 0) {
      this.log.add({
        template: 'No component actions available',
        args: {},
      })
      this.log.outdent()
      return
    }

    const choices = actions.map(a => a.id)
    const selection = this.actions.choose(player, choices, {
      title: 'Choose Component Action',
      noAutoRespond: true,
    })

    const actionId = selection[0]

    // Check if it's a tech component action
    const techAction = techActions.find(a => a.id === actionId)
    if (techAction) {
      techAction.execute(player)
    }
    // Check if it's a relic component action
    else if (relicActions.find(a => a.id === actionId)) {
      relicActions.find(a => a.id === actionId).execute(player)
    }
    else if (actionId === 'purge-relic-fragments') {
      this._executePurgeRelicFragments(player)
    }
    else {
      this.factionAbilities.executeComponentAction(player, actionId)
    }

    this.log.outdent()
  }

  Twilight.prototype._getTechComponentActions = function(player) {
    const actions = []

    // Transit Diodes: exhaust to relocate up to 4 ground forces
    if (this._isTechReady(player, 'transit-diodes')) {
      actions.push({
        id: 'transit-diodes',
        name: 'Transit Diodes',
        execute: (p) => this._executeTransitDiodes(p),
      })
    }

    // Sling Relay: exhaust to produce 1 ship in any system with a space dock
    if (this._isTechReady(player, 'sling-relay')) {
      actions.push({
        id: 'sling-relay',
        name: 'Sling Relay',
        execute: (p) => this._executeSlingRelay(p),
      })
    }

    // Bio-Stims: exhaust to ready 1 planet or 1 technology
    if (this._isTechReady(player, 'bio-stims')) {
      actions.push({
        id: 'bio-stims',
        name: 'Bio-Stims',
        execute: (p) => this._executeBioStims(p),
      })
    }

    // Predictive Intelligence: exhaust to redistribute command tokens
    if (this._isTechReady(player, 'predictive-intelligence')) {
      actions.push({
        id: 'predictive-intelligence',
        name: 'Predictive Intelligence',
        execute: (p) => this._executePredictiveIntelligence(p),
      })
    }

    // Self Assembly Routines: exhaust to place 1 mech on a controlled planet
    if (this._isTechReady(player, 'self-assembly-routines')) {
      actions.push({
        id: 'self-assembly-routines',
        name: 'Self Assembly Routines',
        execute: (p) => this._executeSelfAssemblyRoutines(p),
      })
    }

    // Scanlink Drone Network: registered as passive (in tactical action), not here

    // Production Biomes (Hacan): exhaust + spend 1 strategy token for 4 TG + give 2 TG to another player
    if (this._isTechReady(player, 'production-biomes')
      && (player.commandTokens.strategy >= 1 || this._isRelicReady(player, 'scepter-of-emelpar'))) {
      actions.push({
        id: 'production-biomes',
        name: 'Production Biomes',
        execute: (p) => this._executeProductionBiomes(p),
      })
    }

    // Wormhole Generator (Creuss): exhaust to place or move a Creuss wormhole token
    if (this._isTechReady(player, 'wormhole-generator')) {
      actions.push({
        id: 'wormhole-generator',
        name: 'Wormhole Generator',
        execute: (p) => this._executeWormholeGenerator(p),
      })
    }

    // Inheritance Systems (L1Z1X): exhaust to gain a tech with prereqs <= non-unit-upgrade tech count
    if (this._isTechReady(player, 'inheritance-systems')) {
      actions.push({
        id: 'inheritance-systems',
        name: 'Inheritance Systems',
        execute: (p) => {
          const handler = this.factionAbilities._getPlayerHandler(p)
          if (handler?.inheritanceSystems) {
            handler.inheritanceSystems(this.factionAbilities, p)
          }
        },
      })
    }

    // Psychospore (Arborec): exhaust to remove command token from system with infantry, place 1 infantry
    if (this._isTechReady(player, 'psychospore')) {
      actions.push({
        id: 'psychospore',
        name: 'Psychospore',
        execute: (p) => this._executePsychospore(p),
      })
    }

    // Instinct Training (Xxcha): registered as reaction, not component action

    // Nullification Field (Xxcha): registered as reaction, not component action

    return actions
  }

  Twilight.prototype._executeTransitDiodes = function(player) {
    this._exhaustTech(player, 'transit-diodes')

    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length === 0) {
      return
    }

    // Collect ground forces from all controlled planets
    const groundForces = []
    for (const planetId of controlledPlanets) {
      const systemId = this._findSystemForPlanet(planetId)
      if (!systemId) {
        continue
      }
      const planetUnits = this.state.units[systemId]?.planets[planetId] || []
      for (const u of planetUnits) {
        if (u.owner === player.name && (u.type === 'infantry' || u.type === 'mech')) {
          groundForces.push({ unit: u, planetId, systemId })
        }
      }
    }

    if (groundForces.length === 0) {
      return
    }

    // Let player choose how many to move (up to 4)
    const moveCount = Math.min(4, groundForces.length)
    for (let i = 0; i < moveCount; i++) {
      const remaining = []
      for (const pId of controlledPlanets) {
        const sId = this._findSystemForPlanet(pId)
        if (!sId) {
          continue
        }
        const pUnits = this.state.units[sId]?.planets[pId] || []
        const gf = pUnits.filter(u => u.owner === player.name && (u.type === 'infantry' || u.type === 'mech'))
        if (gf.length > 0) {
          remaining.push(pId)
        }
      }
      if (remaining.length === 0) {
        break
      }

      const fromChoices = ['Done', ...remaining.map(p => `from:${p}`)]
      const fromSel = this.actions.choose(player, fromChoices, {
        title: `Transit Diodes: Move ground force ${i + 1}/${moveCount}`,
      })
      if (fromSel[0] === 'Done') {
        break
      }

      const fromPlanet = fromSel[0].replace('from:', '')
      const fromSystem = this._findSystemForPlanet(fromPlanet)
      if (!fromSystem) {
        continue
      }

      const toSel = this.actions.choose(player, controlledPlanets, {
        title: 'Transit Diodes: Choose destination',
      })
      const toPlanet = toSel[0]
      const toSystem = this._findSystemForPlanet(toPlanet)
      if (!toSystem) {
        continue
      }

      // Move the first matching ground force
      const fromUnits = this.state.units[fromSystem].planets[fromPlanet]
      const gfIdx = fromUnits.findIndex(u => u.owner === player.name && (u.type === 'infantry' || u.type === 'mech'))
      if (gfIdx !== -1) {
        const moved = fromUnits.splice(gfIdx, 1)[0]
        if (!this.state.units[toSystem].planets[toPlanet]) {
          this.state.units[toSystem].planets[toPlanet] = []
        }
        this.state.units[toSystem].planets[toPlanet].push(moved)
      }
    }

    this.log.add({
      template: '{player} uses Transit Diodes to relocate ground forces',
      args: { player },
    })
  }

  Twilight.prototype._executeSlingRelay = function(player) {
    this._exhaustTech(player, 'sling-relay')

    // Find all systems with player's space dock
    const dockSystems = []
    for (const [systemId, systemUnits] of Object.entries(this.state.units)) {
      for (const [_planetId, planetUnits] of Object.entries(systemUnits.planets)) {
        if (planetUnits.some(u => u.owner === player.name && u.type === 'space-dock')) {
          dockSystems.push(systemId)
          break
        }
      }
    }

    if (dockSystems.length === 0) {
      return
    }

    const systemSel = this.actions.choose(player, dockSystems, {
      title: 'Sling Relay: Choose system to produce in',
    })
    const targetSystem = systemSel[0]

    // Choose 1 ship to produce (limited to cost the player can afford)
    const shipTypes = ['fighter', 'destroyer', 'cruiser', 'carrier', 'dreadnought', 'war-sun']
    const affordableShips = shipTypes.filter(type => {
      const def = this._getUnitStats(player.name, type)
      return def && def.cost <= (player.tradeGoods + this._getAvailableResources(player))
    })

    if (affordableShips.length === 0) {
      return
    }

    const shipSel = this.actions.choose(player, affordableShips, {
      title: 'Sling Relay: Choose ship to produce',
    })
    const shipType = shipSel[0]
    const def = this._getUnitStats(player.name, shipType)

    this._addUnit(targetSystem, 'space', shipType, player.name)

    // Pay cost
    let cost = def.cost
    const controlledPlanets = player.getControlledPlanets()
    for (const pId of controlledPlanets) {
      if (cost <= 0) {
        break
      }
      if (!this.state.planets[pId]?.exhausted) {
        const planet = res.getPlanet(pId)
        if (planet) {
          this.state.planets[pId].exhausted = true
          cost -= planet.resources
        }
      }
    }
    if (cost > 0) {
      player.spendTradeGoods(Math.min(cost, player.tradeGoods))
    }

    this.log.add({
      template: '{player} uses Sling Relay to produce a {ship}',
      args: { player, ship: shipType },
    })
  }

  Twilight.prototype._executeBioStims = function(player) {
    this._exhaustTech(player, 'bio-stims')

    // Offer to ready 1 exhausted planet or 1 exhausted technology
    const exhaustedPlanets = player.getControlledPlanets()
      .filter(pId => this.state.planets[pId]?.exhausted)
    const exhaustedTechs = (player.exhaustedTechs || [])
      .filter(id => id !== 'bio-stims')  // can't ready itself

    const choices = [
      ...exhaustedPlanets.map(p => `planet:${p}`),
      ...exhaustedTechs.map(t => `tech:${t}`),
    ]

    if (choices.length === 0) {
      return
    }

    const sel = this.actions.choose(player, choices, {
      title: 'Bio-Stims: Ready a planet or technology',
    })

    const choice = sel[0]
    if (choice.startsWith('planet:')) {
      const planetId = choice.replace('planet:', '')
      this.state.planets[planetId].exhausted = false
      this.log.add({
        template: '{player} uses Bio-Stims to ready {planet}',
        args: { player, planet: planetId },
      })
    }
    else if (choice.startsWith('tech:')) {
      const techId = choice.replace('tech:', '')
      player.exhaustedTechs = player.exhaustedTechs.filter(t => t !== techId)
      this.log.add({
        template: '{player} uses Bio-Stims to ready {tech}',
        args: { player, tech: techId },
      })
    }
  }

  Twilight.prototype._executePredictiveIntelligence = function(player) {
    this._exhaustTech(player, 'predictive-intelligence')

    // Redistribute command tokens
    const sel = this.actions.choose(player, ['Done'], {
      title: 'Predictive Intelligence: Redistribute Command Tokens',
      allowsAction: 'redistribute-tokens',
    })

    if (sel.action === 'redistribute-tokens') {
      player.setCommandTokens(sel)
    }

    this.log.add({
      template: '{player} uses Predictive Intelligence to redistribute tokens',
      args: { player },
    })
  }

  Twilight.prototype._executeSelfAssemblyRoutines = function(player) {
    this._exhaustTech(player, 'self-assembly-routines')

    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length === 0) {
      return
    }

    const sel = this.actions.choose(player, controlledPlanets, {
      title: 'Self Assembly Routines: Place 1 mech',
    })
    const targetPlanet = sel[0]
    const systemId = this._findSystemForPlanet(targetPlanet)

    if (systemId) {
      this._addUnit(systemId, targetPlanet, 'mech', player.name)
      this.log.add({
        template: '{player} uses Self Assembly Routines to place a mech on {planet}',
        args: { player, planet: targetPlanet },
      })
    }
  }

  Twilight.prototype._executeProductionBiomes = function(player) {
    this._exhaustTech(player, 'production-biomes')

    // Scepter of Emelpar: offer to exhaust instead of spending strategy token
    const scepterUsed = this._offerScepterOfEmelpar(player)
    if (!scepterUsed) {
      player.commandTokens.strategy -= 1
    }

    // Gain 4 trade goods
    player.addTradeGoods(4)

    // Choose another player to give 2 trade goods
    const others = this.players.all().filter(p => p.name !== player.name)
    if (others.length > 0) {
      let target
      if (others.length === 1) {
        target = others[0]
      }
      else {
        const sel = this.actions.choose(player, others.map(p => p.name), {
          title: 'Production Biomes: Choose a player to gain 2 trade goods',
        })
        target = this.players.byName(sel[0])
      }

      if (target) {
        target.addTradeGoods(2)
        this.log.add({
          template: '{player} uses Production Biomes: gains 4 TG, {target} gains 2 TG',
          args: { player, target: target.name },
        })
      }
    }
    else {
      this.log.add({
        template: '{player} uses Production Biomes: gains 4 TG',
        args: { player },
      })
    }
  }

  Twilight.prototype._executePsychospore = function(player) {
    this._exhaustTech(player, 'psychospore')

    // Find systems with player's command token AND player's infantry
    const validSystems = []
    for (const [systemId, systemData] of Object.entries(this.state.systems)) {
      if (!systemData.commandTokens.includes(player.name)) {
        continue
      }

      const systemUnits = this.state.units[systemId]
      if (!systemUnits) {
        continue
      }

      // Check for infantry on any planet
      let hasInfantry = false
      for (const [_planetId, planetUnits] of Object.entries(systemUnits.planets)) {
        if (planetUnits.some(u => u.owner === player.name && u.type === 'infantry')) {
          hasInfantry = true
          break
        }
      }

      if (hasInfantry) {
        validSystems.push(systemId)
      }
    }

    if (validSystems.length === 0) {
      this.log.add({
        template: '{player} uses Psychospore: no valid systems',
        args: { player },
      })
      return
    }

    const systemSel = this.actions.choose(player, validSystems, {
      title: 'Psychospore: Remove command token from which system?',
    })
    const targetSystem = systemSel[0]

    // Remove the command token
    const tokenIdx = this.state.systems[targetSystem].commandTokens.indexOf(player.name)
    if (tokenIdx !== -1) {
      this.state.systems[targetSystem].commandTokens.splice(tokenIdx, 1)
      player.commandTokens.tactics += 1
    }

    // Place 1 infantry on a planet in that system
    const tile = res.getSystemTile(targetSystem) || res.getSystemTile(Number(targetSystem))
    if (tile && tile.planets.length > 0) {
      let targetPlanet
      const controlled = tile.planets.filter(
        pId => this.state.planets[pId]?.controller === player.name
      )
      if (controlled.length === 1) {
        targetPlanet = controlled[0]
      }
      else if (controlled.length > 1) {
        const sel = this.actions.choose(player, controlled, {
          title: 'Psychospore: Place infantry on which planet?',
        })
        targetPlanet = sel[0]
      }
      else {
        targetPlanet = tile.planets[0]
      }

      this._addUnitToPlanet(targetSystem, targetPlanet, 'infantry', player.name)

      this.log.add({
        template: '{player} uses Psychospore: removes command token from {system}, places 1 infantry on {planet}',
        args: { player, system: targetSystem, planet: targetPlanet },
      })
    }
  }

  Twilight.prototype._executeWormholeGenerator = function(player) {
    this._exhaustTech(player, 'wormhole-generator')

    // Find valid systems: contains a planet you control, or non-home system without opponent ships,
    // and does not already contain a wormhole (other than the Creuss wormhole itself)
    const validSystems = []
    for (const [systemId, _systemData] of Object.entries(this.state.systems)) {
      const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
      if (!tile) {
        continue
      }

      // Skip home systems (other than the Creuss Gate)
      if (tile.type === 'home') {
        continue
      }

      // Check if system already has a non-Creuss wormhole
      const existingWormholes = (tile.wormholes || []).filter(w => w !== 'delta')
      if (existingWormholes.length > 0) {
        continue
      }

      // Also skip if system already has the Creuss wormhole token
      if (this.state.creussWormholeToken === systemId) {
        continue
      }

      // Option A: system contains a planet controlled by this player
      const hasControlledPlanet = (tile.planets || []).some(
        pId => this.state.planets[pId]?.controller === player.name
      )

      // Option B: non-home system without opponent ships
      const systemUnits = this.state.units[systemId]
      const hasOpponentShips = systemUnits?.space.some(
        u => u.owner !== player.name && res.getUnit(u.type)?.category === 'ship'
      )

      if (hasControlledPlanet || !hasOpponentShips) {
      // Must also have player ships in the system (ships required to place wormhole)
        const hasOwnShips = systemUnits?.space.some(u => u.owner === player.name)
        if (hasOwnShips || hasControlledPlanet) {
          validSystems.push(systemId)
        }
      }
    }

    if (validSystems.length === 0) {
      this.log.add({
        template: '{player} uses Wormhole Generator but no valid systems available',
        args: { player },
      })
      return
    }

    const sel = this.actions.choose(player, validSystems, {
      title: 'Wormhole Generator: Place Creuss wormhole token in which system?',
    })
    const targetSystem = sel[0]

    // Place or move the Creuss wormhole token
    this.state.creussWormholeToken = targetSystem

    this.log.add({
      template: '{player} uses Wormhole Generator to place Creuss wormhole token in system {system}',
      args: { player, system: targetSystem },
    })
  }

  Twilight.prototype._canPurgeRelicFragments = function(player) {
    const fragments = player.relicFragments || []
    if (fragments.length < 3) {
      return false
    }

    const counts = {}
    for (const f of fragments) {
      counts[f] = (counts[f] || 0) + 1
    }
    const unknownCount = counts['unknown'] || 0
    return Object.entries(counts).some(([type, count]) => {
      if (type === 'unknown') {
        return unknownCount >= 3
      }
      return count + unknownCount >= 3
    })
  }

  Twilight.prototype._executePurgeRelicFragments = function(player) {
    const fragments = player.relicFragments || []
    const counts = {}
    for (const f of fragments) {
      counts[f] = (counts[f] || 0) + 1
    }
    const unknownCount = counts['unknown'] || 0

    // Find which types can be purged (3 of same, using unknown as wildcard)
    const purgeableTypes = Object.entries(counts)
      .filter(([type, count]) => {
        if (type === 'unknown') {
          return unknownCount >= 3
        }
        return count + unknownCount >= 3
      })
      .map(([type]) => type)

    if (purgeableTypes.length === 0) {
      return
    }

    let fragType
    if (purgeableTypes.length === 1) {
      fragType = purgeableTypes[0]
    }
    else {
      const sel = this.actions.choose(player, purgeableTypes, {
        title: 'Choose fragment type to purge (3)',
      })
      fragType = sel[0]
    }

    // Remove 3 fragments: prefer typed fragments first, then unknown as needed
    let remaining = 3
    if (fragType !== 'unknown') {
      // Remove typed fragments first
      for (let i = 0; i < 3 && remaining > 0; i++) {
        const idx = player.relicFragments.indexOf(fragType)
        if (idx !== -1) {
          player.relicFragments.splice(idx, 1)
          remaining--
        }
      }
    }
    // Fill remainder with unknown fragments
    while (remaining > 0) {
      const idx = player.relicFragments.indexOf('unknown')
      if (idx !== -1) {
        player.relicFragments.splice(idx, 1)
        remaining--
      }
      else {
        break
      }
    }

    this.log.add({
      template: '{player} purges 3 {type} fragments for a relic',
      args: { player: player.name, type: fragType },
    })

    this._gainRelic(player.name)
  }

} // module.exports
