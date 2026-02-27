const res = require('../res/index.js')

module.exports = function(Twilight) {

  ////////////////////////////////////////////////////////////////////////////////
  // Victory

  Twilight.prototype._checkVictory = function() {
    for (const player of this.players.all()) {
      if (player.getVictoryPoints() >= 10) {
        this.youWin(player, `${player.name} has reached 10 victory points!`)
      }
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Leaders

  /**
 * Check all players' commander and hero unlock conditions.
 * Called after key game events (scoring, combat, gaining resources, etc.)
 */
  Twilight.prototype._checkLeaderUnlocks = function() {
    for (const player of this.players.all()) {
      this._checkCommanderUnlock(player)
      this._checkHeroUnlock(player)
    }
  }

  /**
 * Check if a player's hero should unlock (universal: 3 scored objectives).
 */
  Twilight.prototype._checkHeroUnlock = function(player) {
    if (player.isHeroUnlocked() || player.isHeroPurged()) {
      return
    }

    const scored = this.state.scoredObjectives[player.name] || []
    if (scored.length >= 3) {
      player.unlockHero()
      this.log.add({
        template: '{player} unlocks hero: {name}',
        args: { player, name: player.faction?.leaders?.hero?.name || 'Hero' },
      })
    }
  }

  /**
 * Check if a player's commander should unlock (faction-specific conditions).
 */
  Twilight.prototype._checkCommanderUnlock = function(player) {
    if (player.isCommanderUnlocked()) {
      return
    }

    const factionId = player.faction?.id
    let conditionMet = false

    switch (factionId) {
      case 'federation-of-sol':
      // Have 12 or more ground forces on the game board
        conditionMet = this._countGroundForces(player.name) >= 12
        break
      case 'emirates-of-hacan':
      // Have 10 trade goods
        conditionMet = player.tradeGoods >= 10
        break
      case 'barony-of-letnev':
      // Have 5 non-fighter ships in 1 system
        conditionMet = this._hasNonFighterShipsInOneSystem(player.name, 5)
        break
      case 'sardakk-norr':
      // Control 5 non-home planets
        conditionMet = this._countNonHomePlanets(player.name) >= 5
        break
      case 'universities-of-jol-nar':
      // Have 8 technologies
        conditionMet = player.getTechIds().length >= 8
        break
      case 'l1z1x-mindnet':
      // Have 3+ dreadnoughts on the game board
        conditionMet = this._countUnitsOnBoard(player.name, 'dreadnought') >= 3
        break
      case 'xxcha-kingdom':
      // Control planets with combined influence 12+
        conditionMet = this._getTotalControlledInfluence(player.name) >= 12
        break
      case 'embers-of-muaat':
      // Have a war sun on the game board
        conditionMet = this._countUnitsOnBoard(player.name, 'war-sun') >= 1
        break
      case 'arborec':
      // Have 12+ ground forces on board
        conditionMet = this._countGroundForces(player.name) >= 12
        break
      case 'yssaril-tribes':
      // Have 7 action cards in hand
        conditionMet = (player.actionCards?.length || 0) >= 7
        break
      case 'nomad':
      // Have 1 scored secret objective
        conditionMet = (this.state.scoredObjectives[player.name] || [])
          .some(id => {
            const obj = res.getObjective(id)
            return obj && obj.type === 'secret'
          })
        break
      case 'ghosts-of-creuss':
      // Have units in 3 systems that contain alpha or beta wormholes
        conditionMet = this._countWormholeSystemsWithUnits(player.name) >= 3
        break
      case 'nekro-virus': {
      // Have 3 technologies. Valefar Assimilator counts only if its token is placed.
        const nekroTechs = player.getTechIds()
        const tokens = this.state.assimilatorTokens || {}
        let effectiveCount = 0
        for (const techId of nekroTechs) {
          if (techId === 'valefar-assimilator-x') {
            if (tokens.x) {
              effectiveCount++
            }
          }
          else if (techId === 'valefar-assimilator-y') {
            if (tokens.y) {
              effectiveCount++
            }
          }
          else {
            effectiveCount++
          }
        }
        conditionMet = effectiveCount >= 3
        break
      }
      case 'argent-flight':
      // 6+ units with AFB/SC/Bombardment on board
        conditionMet = this._countCombatAbilityUnits(player.name) >= 6
        break
      case 'empyrean':
      // Be neighbors with all other players
        conditionMet = this._isNeighborWithAll(player.name)
        break
      case 'mahact-gene-sorcerers':
      // 2 other players' command tokens in fleet pool
        conditionMet = (this.state.capturedCommandTokens[player.name] || []).length >= 2
        break
      case 'naaz-rokha-alliance':
      // 3 mechs in 3 different systems
        conditionMet = this._countMechSystems(player.name) >= 3
        break
      case 'titans-of-ul':
      // 5 structures on the game board
        conditionMet = this._countStructures(player.name) >= 5
        break
      case 'vuil-raith-cabal':
      // Units in 3 systems with gravity rifts
        conditionMet = this._countGravityRiftSystems(player.name) >= 3
        break
      case 'clan-of-saar':
      // Have 3 space docks on the game board (Saar floating factories are in space)
        conditionMet = this._countUnitsOnBoard(player.name, 'space-dock') >= 3
        break
      case 'council-keleres':
      // Event-based: "Spend 1 trade good after you play an action card that has a component action"
      // Checked in _playActionCard, not here. Skip.
        break
      default:
        break
    }

    if (conditionMet) {
      player.unlockCommander()
      this.log.add({
        template: '{player} unlocks commander: {name}',
        args: { player, name: player.faction?.leaders?.commander?.name || 'Commander' },
      })
    }
  }

  // Leader helper methods
  Twilight.prototype._countGroundForces = function(playerName) {
    let count = 0
    for (const systemUnits of Object.values(this.state.units)) {
      for (const planetUnits of Object.values(systemUnits.planets)) {
        count += planetUnits.filter(u =>
          u.owner === playerName && res.getUnit(u.type)?.category === 'ground'
        ).length
      }
    }
    return count
  }

  Twilight.prototype._hasNonFighterShipsInOneSystem = function(playerName, count) {
    for (const systemUnits of Object.values(this.state.units)) {
      const nonFighterShips = systemUnits.space.filter(u =>
        u.owner === playerName && u.type !== 'fighter'
      )
      if (nonFighterShips.length >= count) {
        return true
      }
    }
    return false
  }

  Twilight.prototype._countNonHomePlanets = function(playerName) {
    let count = 0
    for (const [planetId, planetState] of Object.entries(this.state.planets)) {
      if (planetState.controller !== playerName) {
        continue
      }
      const systemId = this._findSystemForPlanet(planetId)
      if (systemId && !systemId.includes('-home')) {
        count++
      }
    }
    return count
  }

  Twilight.prototype._countUnitsOnBoard = function(playerName, unitType) {
    let count = 0
    for (const systemUnits of Object.values(this.state.units)) {
      count += systemUnits.space.filter(u =>
        u.owner === playerName && u.type === unitType
      ).length
      for (const planetUnits of Object.values(systemUnits.planets)) {
        count += planetUnits.filter(u =>
          u.owner === playerName && u.type === unitType
        ).length
      }
    }
    return count
  }

  Twilight.prototype._getTotalControlledInfluence = function(playerName) {
    let total = 0
    for (const [planetId, planetState] of Object.entries(this.state.planets)) {
      if (planetState.controller !== playerName) {
        continue
      }
      const planet = res.getPlanet(planetId)
      if (planet) {
        total += planet.influence
      }
    }
    return total
  }

  Twilight.prototype._hasUnitsNearWormholes = function(playerName, wormholeType) {
  // Check if player has units in or adjacent to systems with this wormhole type
    const { Galaxy } = require('../model/Galaxy.js')
    const galaxy = new Galaxy(this)
    const wormholeSystems = galaxy.getSystemsWithWormhole(wormholeType)

    for (const sysId of wormholeSystems) {
    // Check units in the wormhole system itself
      const sysUnits = this.state.units[sysId]
      if (sysUnits) {
        if (sysUnits.space.some(u => u.owner === playerName)) {
          return true
        }
        for (const planetUnits of Object.values(sysUnits.planets)) {
          if (planetUnits.some(u => u.owner === playerName)) {
            return true
          }
        }
      }

      // Check adjacent systems
      const adjacent = galaxy.getAdjacent(sysId)
      for (const adjId of adjacent) {
        const adjUnits = this.state.units[adjId]
        if (adjUnits) {
          if (adjUnits.space.some(u => u.owner === playerName)) {
            return true
          }
          for (const planetUnits of Object.values(adjUnits.planets)) {
            if (planetUnits.some(u => u.owner === playerName)) {
              return true
            }
          }
        }
      }
    }
    return false
  }

  Twilight.prototype._countWormholeSystemsWithUnits = function(playerName) {
    const { Galaxy } = require('../model/Galaxy.js')
    const galaxy = new Galaxy(this)
    let count = 0

    for (const [systemId, systemUnits] of Object.entries(this.state.units)) {
    // Check if this system contains an alpha or beta wormhole
      if (!galaxy.hasWormhole(systemId, 'alpha') && !galaxy.hasWormhole(systemId, 'beta')) {
        continue
      }

      // Check if player has units in this system
      const hasUnits = systemUnits.space.some(u => u.owner === playerName) ||
      Object.values(systemUnits.planets).some(pu => pu.some(u => u.owner === playerName))
      if (hasUnits) {
        count++
      }
    }
    return count
  }

  Twilight.prototype._countCombatAbilityUnits = function(playerName) {
    let count = 0
    for (const systemUnits of Object.values(this.state.units)) {
      for (const unit of systemUnits.space) {
        if (unit.owner !== playerName) {
          continue
        }
        const def = this._getUnitStats(unit.owner, unit.type)
        if (def?.abilities?.some(a =>
          a.startsWith('anti-fighter-barrage-') ||
        a.startsWith('space-cannon-') ||
        a.startsWith('bombardment-')
        )) {
          count++
        }
      }
      for (const planetUnits of Object.values(systemUnits.planets)) {
        for (const unit of planetUnits) {
          if (unit.owner !== playerName) {
            continue
          }
          const def = this._getUnitStats(unit.owner, unit.type)
          if (def?.abilities?.some(a =>
            a.startsWith('anti-fighter-barrage-') ||
          a.startsWith('space-cannon-') ||
          a.startsWith('bombardment-')
          )) {
            count++
          }
        }
      }
    }
    return count
  }

  Twilight.prototype._isNeighborWithAll = function(playerName) {
    const otherPlayers = this.players.all().filter(p => p.name !== playerName)
    return otherPlayers.every(other => this.areNeighbors(playerName, other.name))
  }

  Twilight.prototype._countMechSystems = function(playerName) {
    let systems = 0
    for (const systemUnits of Object.values(this.state.units)) {
      let hasMech = false
      for (const planetUnits of Object.values(systemUnits.planets)) {
        if (planetUnits.some(u => u.owner === playerName && u.type === 'mech')) {
          hasMech = true
          break
        }
      }
      if (hasMech) {
        systems++
      }
    }
    return systems
  }

  Twilight.prototype._countStructures = function(playerName) {
    let count = 0
    for (const systemUnits of Object.values(this.state.units)) {
      for (const planetUnits of Object.values(systemUnits.planets)) {
        count += planetUnits.filter(u => {
          if (u.owner !== playerName) {
            return false
          }
          const def = res.getUnit(u.type)
          return def?.category === 'structure'
        }).length
      }
    }
    return count
  }

  Twilight.prototype._countGravityRiftSystems = function(playerName) {
    let count = 0
    for (const [systemId, systemUnits] of Object.entries(this.state.units)) {
      const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
      const isGravityRift = tile && tile.anomaly === 'gravity-rift'

      // Vuil'raith Cabal: Dimensional Tear space docks create gravity rifts.
      // Check both space area (floating factories) and planet areas for Cabal docks.
      let hasCabalDock = systemUnits.space.some(
        u => u.owner === playerName && u.type === 'space-dock'
      )
      if (!hasCabalDock) {
        for (const planetUnits of Object.values(systemUnits.planets)) {
          if (planetUnits.some(u => u.owner === playerName && u.type === 'space-dock')) {
            hasCabalDock = true
            break
          }
        }
      }

      if (!isGravityRift && !hasCabalDock) {
        continue
      }

      const hasUnits = systemUnits.space.some(u => u.owner === playerName) ||
      Object.values(systemUnits.planets).some(pu => pu.some(u => u.owner === playerName))
      if (hasUnits) {
        count++
      }
    }
    return count
  }

} // module.exports
