module.exports = {
  componentActions: [
    {
      id: 'l1z1x-hero',
      name: 'The Helmsman',
      abilityId: 'harrow',  // reuse faction ability ID for availability gate
      isAvailable: function(player) {
        return player.isHeroUnlocked() && !player.isHeroPurged()
      },
    },
  ],

  // ---------------------------------------------------------------------------
  // Agent — I48S: After another player activates a system that contains your
  // units, you may exhaust this card; the active player removes 1 token from
  // their fleet pool and returns it to their reinforcements.
  // ---------------------------------------------------------------------------
  onAnySystemActivated(l1z1xPlayer, ctx, { systemId, activatingPlayer }) {
    if (activatingPlayer.name === l1z1xPlayer.name) {
      return
    }

    if (!l1z1xPlayer.isAgentReady()) {
      return
    }

    // Check if L1Z1X has units in the activated system
    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return
    }

    const hasShips = systemUnits.space.some(u => u.owner === l1z1xPlayer.name)
    let hasPlanetUnits = false
    if (!hasShips && systemUnits.planets) {
      for (const planetId of Object.keys(systemUnits.planets)) {
        if (systemUnits.planets[planetId].some(u => u.owner === l1z1xPlayer.name)) {
          hasPlanetUnits = true
          break
        }
      }
    }

    if (!hasShips && !hasPlanetUnits) {
      return
    }

    // Check if the activating player has fleet tokens to remove
    const target = ctx.players.byName(activatingPlayer.name)
    if (!target || target.commandTokens.fleet <= 0) {
      return
    }

    const choice = ctx.actions.choose(l1z1xPlayer, ['Exhaust I48S', 'Pass'], {
      title: `I48S: ${activatingPlayer.name} activated a system with your units. Exhaust to remove 1 fleet token?`,
    })

    if (choice[0] !== 'Exhaust I48S') {
      return
    }

    l1z1xPlayer.exhaustAgent()

    // Re-fetch target after agent exhaust (stale ref)
    const updatedTarget = ctx.players.byName(activatingPlayer.name)
    updatedTarget.commandTokens.fleet -= 1

    ctx.log.add({
      template: 'I48S: {player} exhausts agent; {target} loses 1 fleet token',
      args: { player: l1z1xPlayer.name, target: activatingPlayer.name },
    })
  },

  // ---------------------------------------------------------------------------
  // Hero — The Helmsman: DARK SPACE NAVIGATION
  // ACTION: Choose a system that does not contain other players' ships;
  // place your flagship and up to 2 dreadnoughts from your reinforcements
  // in that system. Then, purge this card.
  // ---------------------------------------------------------------------------

  l1z1xHero(ctx, player) {
    // Find systems without other players' ships
    const eligibleSystems = []
    for (const [systemId, _systemData] of Object.entries(ctx.state.systems)) {
      const systemUnits = ctx.state.units[systemId]
      if (!systemUnits) {
        // No units at all in this system — eligible (no opponent ships)
        eligibleSystems.push(systemId)
        continue
      }
      const hasOpponentShips = systemUnits.space.some(
        u => u.owner !== player.name
      )
      if (!hasOpponentShips) {
        eligibleSystems.push(systemId)
      }
    }

    if (eligibleSystems.length === 0) {
      player.purgeHero()
      ctx.log.add({
        template: '{player} purges The Helmsman but no eligible systems',
        args: { player: player.name },
      })
      return
    }

    const systemSelection = ctx.actions.choose(player, eligibleSystems, {
      title: 'Dark Space Navigation: Choose system to place flagship + dreadnoughts',
    })
    const targetSystem = systemSelection[0]

    // Place flagship
    ctx.game._addUnit(targetSystem, 'space', 'flagship', player.name)

    // Place up to 2 dreadnoughts
    for (let i = 0; i < 2; i++) {
      const choice = ctx.actions.choose(player, ['Place Dreadnought', 'Done'], {
        title: `Dark Space Navigation: Place dreadnought ${i + 1}/2?`,
      })
      if (choice[0] === 'Done') {
        break
      }
      ctx.game._addUnit(targetSystem, 'space', 'dreadnought', player.name)
    }

    player.purgeHero()
    ctx.log.add({
      template: 'Dark Space Navigation: {player} places flagship and dreadnoughts in {system}',
      args: { player: player.name, system: targetSystem },
    })
  },

  // ---------------------------------------------------------------------------
  // Fealty Uplink (faction tech): When you score a public objective, if you
  // have more command tokens on the game board than each other player, gain
  // 1 command token.
  // ---------------------------------------------------------------------------

  onPublicObjectiveScored(player, ctx) {
    if (!player.hasTechnology('fealty-uplink')) {
      return
    }

    // Count command tokens on the board for each player
    const tokenCounts = {}
    for (const p of ctx.players.all()) {
      tokenCounts[p.name] = 0
    }

    for (const [_systemId, systemData] of Object.entries(ctx.state.systems)) {
      for (const tokenOwner of (systemData.commandTokens || [])) {
        if (tokenCounts[tokenOwner] !== undefined) {
          tokenCounts[tokenOwner]++
        }
      }
    }

    const playerTokens = tokenCounts[player.name]
    const hasMoreThanAll = ctx.players.all()
      .filter(p => p.name !== player.name)
      .every(p => playerTokens > (tokenCounts[p.name] || 0))

    if (hasMoreThanAll) {
      player.commandTokens.tactics += 1
      ctx.log.add({
        template: 'Fealty Uplink: {player} gains 1 command token (most tokens on board)',
        args: { player: player.name },
      })
    }
  },

  // ---------------------------------------------------------------------------
  // Assimilate: When you gain control of a planet, replace each PDS and space
  // dock on that planet with a matching unit from your reinforcements.
  // ---------------------------------------------------------------------------

  onPlanetGained(player, ctx, { planetId, systemId, structureCounts }) {
    let placed = false
    for (const [unitType, count] of Object.entries(structureCounts)) {
      if (unitType === 'pds' || unitType === 'space-dock') {
        for (let i = 0; i < count; i++) {
          ctx.game._addUnitToPlanet(systemId, planetId, unitType, player.name)
          placed = true
        }
      }
    }

    if (placed) {
      ctx.log.add({
        template: '{player} assimilates structures on {planet}',
        args: { player, planet: planetId },
      })
    }
  },

  // ---------------------------------------------------------------------------
  // Harrow: At the end of each round of ground combat, your ships in the
  // active system may use their BOMBARDMENT abilities against your opponent's
  // ground forces on the planet.
  //
  // Commander (2RAM): Each of your dreadnoughts and war suns that are in or
  // adjacent to the active system may participate in ground combat as if they
  // were ground forces. They are not considered ground forces for the purposes
  // of other game effects.
  // ---------------------------------------------------------------------------

  onGroundCombatRoundEnd(player, ctx, { systemId, planetId, opponentName }) {
    // --- Harrow: bombardment from ships in the active system ---
    this._harrowBombardment(player, ctx, systemId, planetId, opponentName)

    // --- Commander (2RAM): dreadnoughts/war suns roll combat dice ---
    if (player.isCommanderUnlocked()) {
      this._commanderGroundCombat(player, ctx, systemId, planetId, opponentName)
    }
  },

  // Harrow: ships with bombardment abilities fire at ground forces each round
  _harrowBombardment(player, ctx, systemId, planetId, opponentName) {
    const systemUnits = ctx.state.units[systemId]
    const bombardShips = systemUnits.space.filter(u => {
      if (u.owner !== player.name || u.type === 'fighter') {
        return false
      }
      const stats = ctx.game._getUnitStats(u.owner, u.type)
      return stats?.abilities?.some(a => a.startsWith('bombardment-'))
    })

    if (bombardShips.length === 0) {
      return
    }

    let totalHits = 0
    for (const ship of bombardShips) {
      const stats = ctx.game._getUnitStats(ship.owner, ship.type)
      const bombAbility = stats.abilities.find(a => a.startsWith('bombardment-'))
      if (!bombAbility) {
        continue
      }
      const parts = bombAbility.replace('bombardment-', '').split('x')
      const combatValue = parseInt(parts[0])
      const diceCount = parseInt(parts[1])
      for (let i = 0; i < diceCount; i++) {
        const roll = Math.floor(ctx.game.random() * 10) + 1
        if (roll >= combatValue) {
          totalHits++
        }
      }
    }

    if (totalHits > 0) {
      ctx.log.add({
        template: '{player} Harrow bombardment: {hits} hits on {planet}',
        args: { player, hits: totalHits, planet: planetId },
      })
      ctx.game._assignGroundHits(systemId, planetId, opponentName, totalHits, player.name)
    }
  },

  // Commander (2RAM): dreadnoughts and war suns participate in ground combat
  // as if they were ground forces (rolling combat dice, not bombardment).
  // Includes ships in the active system AND adjacent systems.
  _commanderGroundCombat(player, ctx, systemId, planetId, opponentName) {
    const eligibleShips = this._getCommanderEligibleShips(player, ctx, systemId)

    if (eligibleShips.length === 0) {
      return
    }

    // Roll combat dice for each eligible ship (using combat values)
    let totalHits = 0
    for (const ship of eligibleShips) {
      const stats = ctx.game._getUnitStats(ship.owner, ship.type)
      if (!stats || !stats.combat) {
        continue
      }

      // War suns roll 3 dice, others roll 1
      const diceCount = stats.type === 'war-sun' ? 3 : 1
      for (let i = 0; i < diceCount; i++) {
        const roll = Math.floor(ctx.game.random() * 10) + 1
        if (roll >= stats.combat) {
          totalHits++
        }
      }
    }

    if (totalHits > 0) {
      ctx.log.add({
        template: '2RAM: {player} dreadnoughts/war suns score {hits} ground combat hits on {planet}',
        args: { player, hits: totalHits, planet: planetId },
      })
      ctx.game._assignGroundHits(systemId, planetId, opponentName, totalHits, player.name)
    }
  },

  // Collect dreadnoughts and war suns in the active system and adjacent systems
  _getCommanderEligibleShips(player, ctx, systemId) {
    const eligible = []

    // Ships in the active system
    const systemUnits = ctx.state.units[systemId]
    if (systemUnits) {
      for (const ship of systemUnits.space) {
        if (ship.owner === player.name && (ship.type === 'dreadnought' || ship.type === 'war-sun')) {
          eligible.push(ship)
        }
      }
    }

    // Ships in adjacent systems
    const adjacentIds = ctx.game._getAdjacentSystems(systemId)
    for (const adjId of adjacentIds) {
      const adjUnits = ctx.state.units[adjId]
      if (!adjUnits) {
        continue
      }
      for (const ship of adjUnits.space) {
        if (ship.owner === player.name && (ship.type === 'dreadnought' || ship.type === 'war-sun')) {
          eligible.push(ship)
        }
      }
    }

    return eligible
  },


  // ---------------------------------------------------------------------------
  // Mech — Annihilator DEPLOY: When you use BOMBARDMENT, you may spend 2
  // resources to place 1 mech from reinforcements on that planet.
  // ---------------------------------------------------------------------------

  afterBombardment(player, ctx, { systemId, planetId, totalHits: _totalHits }) {
    // Check if player has resources to spend
    const totalResources = player.getTotalResources() + player.tradeGoods
    if (totalResources < 2) {
      return
    }

    if (!ctx.game._hasReinforcementsAvailable(player.name, 'mech')) {
      return
    }

    const choice = ctx.actions.choose(player, ['Deploy Annihilator', 'Pass'], {
      title: 'Annihilator DEPLOY: Spend 2 resources to place 1 mech on the bombarded planet?',
    })

    if (choice[0] !== 'Deploy Annihilator') {
      return
    }

    // Pay 2 resources — spend trade goods first, then exhaust planets
    let remaining = 2
    if (player.tradeGoods > 0) {
      const fromTG = Math.min(player.tradeGoods, remaining)
      player.spendTradeGoods(fromTG)
      remaining -= fromTG
    }
    if (remaining > 0) {
      const readyPlanets = player.getReadyPlanets()
        .map(pId => {
          const planet = ctx.game.res.getPlanet(pId)
          return { id: pId, resources: planet?.resources || 0 }
        })
        .sort((a, b) => a.resources - b.resources)

      for (const planet of readyPlanets) {
        if (remaining <= 0) {
          break
        }
        ctx.state.planets[planet.id].exhausted = true
        remaining -= planet.resources
      }
    }

    ctx.game._addUnitToPlanet(systemId, planetId, 'mech', player.name)

    ctx.log.add({
      template: 'Annihilator DEPLOY: {player} spends 2 resources to place mech on {planet}',
      args: { player: player.name, planet: planetId },
    })
  },


  // ---------------------------------------------------------------------------
  // Super Dreadnought II: Cannot be destroyed by Direct Hit action card.
  // ---------------------------------------------------------------------------

  isDirectHitImmune(player, ctx, unit) {
    if (unit.type !== 'dreadnought' || unit.owner !== player.name) {
      return false
    }
    return player.hasTechnology('super-dreadnought-ii')
  },


  // ---------------------------------------------------------------------------
  // Inheritance Systems (faction tech, component action):
  // ACTION: Exhaust this card to gain a technology that has the same or fewer
  // prerequisites as the number of non-unit-upgrade technologies you own.
  // You don't need to meet color prerequisites.
  // ---------------------------------------------------------------------------

  inheritanceSystems(ctx, player) {
    ctx.game._exhaustTech(player, 'inheritance-systems')

    // Count non-unit-upgrade technologies the player owns
    const techIds = player.getTechIds()
    const res = ctx.game.res
    const allTechs = [...res.getGenericTechnologies()]
    if (player.faction?.factionTechnologies) {
      allTechs.push(...player.faction.factionTechnologies)
    }

    let nonUnitUpgradeCount = 0
    for (const techId of techIds) {
      const tech = res.getTechnology(techId)
      if (tech && !tech.unitUpgrade) {
        nonUnitUpgradeCount++
      }
    }

    // Find all technologies that have <= nonUnitUpgradeCount prerequisites
    // and the player doesn't already own
    const available = allTechs.filter(t => {
      if (techIds.includes(t.id)) {
        return false
      }
      return t.prerequisites.length <= nonUnitUpgradeCount
    })

    if (available.length === 0) {
      ctx.log.add({
        template: '{player} exhausts Inheritance Systems but no technologies available',
        args: { player },
      })
      return
    }

    const choices = available.map(t => t.id)
    const selection = ctx.actions.choose(player, choices, {
      title: 'Inheritance Systems: Choose a technology to gain',
    })

    const chosenTechId = selection[0]
    ctx.game._grantTechnology(player, chosenTechId)

    ctx.log.add({
      template: '{player} uses Inheritance Systems to gain {tech}',
      args: { player, tech: chosenTechId },
    })
  },
}
