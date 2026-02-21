const { GameProxy } = require('../../lib/game/GameProxy.js')
const res = require('../res/index.js')


class FactionAbilities {
  constructor(game) {
    this.game = game
    return GameProxy.create(this)
  }

  // ---------------------------------------------------------------------------
  // Shared helper
  // ---------------------------------------------------------------------------

  _hasAbility(player, abilityId) {
    return player.faction?.abilities?.some(a => a.id === abilityId) ?? false
  }


  // ---------------------------------------------------------------------------
  // A. Passive Modifiers — pure value queries, no mutation
  // ---------------------------------------------------------------------------

  getCombatModifier(player) {
    let modifier = 0
    if (this._hasAbility(player, 'fragile')) {
      modifier += 1
    }
    if (this._hasAbility(player, 'unrelenting')) {
      modifier -= 1
    }
    return modifier
  }

  getStatusPhaseTokenBonus(player) {
    return this._hasAbility(player, 'versatile') ? 1 : 0
  }

  canTradeWithNonNeighbors(player) {
    return this._hasAbility(player, 'guild-ships')
  }

  getTechPrerequisiteSkips(player, tech) {
    let skips = 0
    if (this._hasAbility(player, 'analytical') && !tech.unitUpgrade) {
      skips += 1
    }
    // Brilliant: exhaust 2 techs to skip 1 more prereq (need 2+ techs, non-unit-upgrade only)
    if (this._hasAbility(player, 'brilliant') && !tech.unitUpgrade
        && (player.getTechIds?.()?.length ?? 0) >= 2) {
      skips += 1
    }
    return skips
  }

  // Called after tech research — if brilliant was needed, exhaust 2 techs
  onTechResearched(player, tech) {
    if (!this._hasAbility(player, 'brilliant')) {
      return
    }

    // Check if brilliant was actually needed (deficit > analytical skips)
    const prereqs = player.getTechPrerequisites()
    const needed = {}
    for (const color of tech.prerequisites) {
      needed[color] = (needed[color] || 0) + 1
    }

    let analyticalSkips = 0
    if (this._hasAbility(player, 'analytical') && !tech.unitUpgrade) {
      analyticalSkips = 1
    }

    let deficit = 0
    for (const [color, count] of Object.entries(needed)) {
      const shortfall = count - (prereqs[color] || 0)
      if (shortfall > 0) {
        deficit += shortfall
      }
    }

    // Brilliant was only used if deficit > analytical skips
    if (deficit <= analyticalSkips) {
      return
    }

    // Exhaust 2 technologies
    const techIds = player.getTechIds().filter(id => {
      return !(player.exhaustedTechs || []).includes(id)
    })
    if (techIds.length < 2) {
      return
    }

    for (let i = 0; i < 2; i++) {
      const available = player.getTechIds().filter(id => {
        return !(player.exhaustedTechs || []).includes(id)
      })
      const selection = this.actions.choose(player, available, {
        title: `Brilliant: Exhaust technology (${i + 1}/2)`,
      })
      if (!player.exhaustedTechs) {
        player.exhaustedTechs = []
      }
      player.exhaustedTechs.push(selection[0])
    }

    this.log.add({
      template: '{player} exhausts 2 technologies (Brilliant)',
      args: { player },
    })
  }

  canSkipTradeSecondaryCost(player) {
    return this._hasAbility(player, 'masters-of-trade')
  }

  getActionCardHandLimit(player) {
    if (this._hasAbility(player, 'crafty')) {
      return Infinity
    }
    return 7
  }

  getCustodiansCost(player) {
    return this._hasAbility(player, 'blood-ties') ? 0 : 6
  }

  canMoveThroughSupernovae(playerName) {
    const player = this.players.byName(playerName)
    return player ? this._hasAbility(player, 'gashlai-physiology') : false
  }


  // ---------------------------------------------------------------------------
  // B. Component Actions — data-driven registry
  // ---------------------------------------------------------------------------

  _componentActionHandlers = [
    {
      id: 'orbital-drop',
      name: 'Orbital Drop',
      abilityId: 'orbital-drop',
      isAvailable: (player) => player.commandTokens.tactics >= 1,
      execute: '_orbitalDrop',
    },
    {
      id: 'stall-tactics',
      name: 'Stall Tactics',
      abilityId: 'stall-tactics',
      isAvailable: (player) => (player.actionCards || []).length > 0,
      execute: '_stallTactics',
    },
    {
      id: 'star-forge',
      name: 'Star Forge',
      abilityId: 'star-forge',
      isAvailable: (player) => player.commandTokens.strategy >= 1,
      execute: '_starForge',
    },
    {
      id: 'fabrication',
      name: 'Fabrication',
      abilityId: 'fabrication',
      isAvailable: (player) => (player.relicFragments || []).length >= 1,
      execute: '_fabrication',
    },
    {
      id: 'amalgamation',
      name: 'Amalgamation',
      abilityId: 'amalgamation',
      isAvailable: (player) => (this.game?.state?.capturedUnits?.[player.name] || []).length > 0,
      execute: '_amalgamation',
    },
    {
      id: 'riftmeld',
      name: 'Riftmeld',
      abilityId: 'riftmeld',
      isAvailable: (player) => (this.game?.state?.capturedUnits?.[player.name] || []).length > 0,
      execute: '_riftmeld',
    },
  ]

  getAvailableComponentActions(player) {
    return this._componentActionHandlers
      .filter(h => this._hasAbility(player, h.abilityId) && h.isAvailable(player))
      .map(h => ({ id: h.id, name: h.name }))
  }

  executeComponentAction(player, actionId) {
    const handler = this._componentActionHandlers.find(h => h.id === actionId)
    if (handler) {
      this[handler.execute](player)
    }
  }

  _orbitalDrop(player) {
    // Spend 1 command token from tactics
    player.commandTokens.tactics -= 1

    // Choose a planet you control
    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length === 0) {
      return
    }

    const selection = this.actions.choose(player, controlledPlanets, {
      title: 'Choose planet for Orbital Drop',
    })
    const targetPlanet = selection[0]
    const systemId = this.game._findSystemForPlanet(targetPlanet)

    if (systemId) {
      // Place 2 infantry
      this.game._addUnitToPlanet(systemId, targetPlanet, 'infantry', player.name)
      this.game._addUnitToPlanet(systemId, targetPlanet, 'infantry', player.name)

      this.log.add({
        template: '{player} uses Orbital Drop: 2 infantry on {planet}',
        args: { player, planet: targetPlanet },
      })
    }
  }

  _stallTactics(player) {
    const cards = player.actionCards || []
    if (cards.length === 0) {
      return
    }

    const choices = cards.map(c => c.id)
    const selection = this.actions.choose(player, choices, {
      title: 'Discard Action Card (Stall Tactics)',
    })

    const cardId = selection[0]
    player.actionCards = cards.filter(c => c.id !== cardId)

    this.log.add({
      template: '{player} uses Stall Tactics: discards an action card',
      args: { player },
    })
  }

  _starForge(player) {
    // Find systems with player's war suns
    const warSunSystems = []
    for (const [systemId, systemUnits] of Object.entries(this.state.units)) {
      if (systemUnits.space.some(u => u.owner === player.name && u.type === 'war-sun')) {
        warSunSystems.push(systemId)
      }
    }

    if (warSunSystems.length === 0) {
      return
    }

    // Spend 1 strategy token
    player.commandTokens.strategy -= 1

    // Choose unit type to place
    const unitChoice = this.actions.choose(player, ['2 Fighters', '1 Destroyer'], {
      title: 'Star Forge: Choose units to place',
    })

    // Choose system (auto if only one)
    let targetSystem
    if (warSunSystems.length === 1) {
      targetSystem = warSunSystems[0]
    }
    else {
      const sysChoice = this.actions.choose(player, warSunSystems, {
        title: 'Star Forge: Choose system',
      })
      targetSystem = sysChoice[0]
    }

    if (unitChoice[0] === '2 Fighters') {
      this.game._addUnit(targetSystem, 'space', 'fighter', player.name)
      this.game._addUnit(targetSystem, 'space', 'fighter', player.name)
      this.log.add({
        template: '{player} uses Star Forge: 2 fighters in {system}',
        args: { player, system: targetSystem },
      })
    }
    else {
      this.game._addUnit(targetSystem, 'space', 'destroyer', player.name)
      this.log.add({
        template: '{player} uses Star Forge: 1 destroyer in {system}',
        args: { player, system: targetSystem },
      })
    }
  }


  // ---------------------------------------------------------------------------
  // C. Combat Triggers — event-driven, called from space combat flow
  // ---------------------------------------------------------------------------

  onSpaceCombatStart(systemId, attacker, defender) {
    this._mentakAmbush(systemId, attacker, defender)
  }

  onSpaceCombatRound(systemId, attacker, defender) {
    this._munitionsReserves(systemId, attacker, defender)
  }

  afterSpaceCombatRound(systemId, attacker, defender) {
    this._yinDevotion(systemId, attacker, defender)
  }

  _munitionsReserves(systemId, attacker, defender) {
    const systemUnits = this.state.units[systemId]

    for (const combatant of [attacker, defender]) {
      const player = this.players.byName(combatant)
      if (!this._hasAbility(player, 'munitions-reserves')) {
        continue
      }
      if (player.tradeGoods < 2) {
        continue
      }

      // Check player has ships in this combat
      const hasShips = systemUnits.space.some(u => u.owner === combatant)
      if (!hasShips) {
        continue
      }

      const choice = this.actions.choose(player, ['Reroll', 'Pass'], {
        title: 'Munitions Reserves: Spend 2 trade goods to reroll dice?',
      })

      if (choice[0] === 'Reroll') {
        player.spendTradeGoods(2)
        this.log.add({
          template: '{player} spends 2 trade goods for Munitions Reserves reroll',
          args: { player },
        })
      }
    }
  }

  _mentakAmbush(systemId, attacker, defender) {
    const systemUnits = this.state.units[systemId]

    // Both sides can potentially be Mentak
    for (const [shooter, target] of [[attacker, defender], [defender, attacker]]) {
      const shooterPlayer = this.players.byName(shooter)
      if (!this._hasAbility(shooterPlayer, 'ambush')) {
        continue
      }

      // Check that Mentak has non-fighter ships in this system
      const hasShips = systemUnits.space.some(u => u.owner === shooter && u.type !== 'fighter')
      if (!hasShips) {
        continue
      }

      // Roll 2 dice, 9+ each destroy 1 non-fighter ship
      let hits = 0
      for (let i = 0; i < 2; i++) {
        const roll = Math.floor(this.game.random() * 10) + 1
        if (roll >= 9) {
          hits++
        }
      }

      if (hits > 0) {
        this.log.add({
          template: '{shooter} Ambush scores {hits} hits',
          args: { shooter, hits },
        })

        // Destroy non-fighter ships (auto-assign: cheapest first)
        for (let i = 0; i < hits; i++) {
          const nonFighters = systemUnits.space
            .filter(u => u.owner === target && u.type !== 'fighter')
            .sort((a, b) => {
              const defA = this.game._getUnitStats(a.owner, a.type)
              const defB = this.game._getUnitStats(b.owner, b.type)
              return (defA?.cost || 0) - (defB?.cost || 0)
            })

          if (nonFighters.length > 0) {
            const toDestroy = nonFighters[0]
            const idx = systemUnits.space.indexOf(toDestroy)
            if (idx !== -1) {
              systemUnits.space.splice(idx, 1)
            }
          }
        }
      }
    }
  }


  _yinDevotion(systemId, attacker, defender) {
    const systemUnits = this.state.units[systemId]

    for (const [shooter, target] of [[attacker, defender], [defender, attacker]]) {
      const player = this.players.byName(shooter)
      if (!this._hasAbility(player, 'devotion')) {
        continue
      }

      // Check for cruisers or destroyers
      const sacrificeShips = systemUnits.space
        .filter(u => u.owner === shooter && (u.type === 'cruiser' || u.type === 'destroyer'))

      if (sacrificeShips.length === 0) {
        continue
      }

      // Check opponent has ships
      const enemyShips = systemUnits.space.filter(u => u.owner === target)
      if (enemyShips.length === 0) {
        continue
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

      const selection = this.actions.choose(player, choices, {
        title: 'Devotion: Destroy a ship to produce 1 hit?',
      })

      if (selection[0] === 'Pass') {
        continue
      }

      const shipType = selection[0] === 'Destroy cruiser' ? 'cruiser' : 'destroyer'
      const shipIdx = systemUnits.space.findIndex(u => u.owner === shooter && u.type === shipType)
      if (shipIdx !== -1) {
        systemUnits.space.splice(shipIdx, 1)
      }

      // Assign 1 hit to opponent (destroy cheapest ship)
      const targetShips = systemUnits.space
        .filter(u => u.owner === target)
        .sort((a, b) => {
          const defA = this.game._getUnitStats(a.owner, a.type)
          const defB = this.game._getUnitStats(b.owner, b.type)
          return (defA?.cost || 0) - (defB?.cost || 0)
        })

      if (targetShips.length > 0) {
        const toDestroy = targetShips[0]
        const idx = systemUnits.space.indexOf(toDestroy)
        if (idx !== -1) {
          systemUnits.space.splice(idx, 1)
        }
      }

      this.log.add({
        template: '{player} uses Devotion: destroys {ship} to produce 1 hit',
        args: { player, ship: shipType },
      })
    }
  }


  // ---------------------------------------------------------------------------
  // D. Action Card Triggers
  // ---------------------------------------------------------------------------

  onActionCardDraw(player, drawn) {
    this._scheming(player, drawn)
  }

  _scheming(player, drawn) {
    if (!this._hasAbility(player, 'scheming')) {
      return
    }
    if (drawn.length === 0) {
      return
    }

    // Draw 1 additional card
    this.game._initActionCardDeck()
    if (this.state.actionCardDeck.length > 0) {
      const bonus = this.state.actionCardDeck.pop()
      player.actionCards.push(bonus)

      this.log.add({
        template: '{player} draws 1 extra card (Scheming)',
        args: { player },
      })
    }

    // Must discard 1 card from hand
    const cards = player.actionCards || []
    if (cards.length === 0) {
      return
    }

    const choices = cards.map(c => c.id)
    const selection = this.actions.choose(player, choices, {
      title: 'Scheming: Discard 1 action card',
    })

    const cardId = selection[0]
    player.actionCards = player.actionCards.filter(c => c.id !== cardId)
  }


  // ---------------------------------------------------------------------------
  // E. Movement Triggers
  // ---------------------------------------------------------------------------

  onShipsEnterSystem(systemId, moverName) {
    this._naaluForesight(systemId, moverName)
  }

  _naaluForesight(systemId, moverName) {
    const systemUnits = this.state.units[systemId]
    if (!systemUnits) {
      return
    }

    // Find players with ships in the system before the move who have foresight
    for (const presentPlayer of this.players.all()) {
      if (presentPlayer.name === moverName) {
        continue
      }
      if (!this._hasAbility(presentPlayer, 'foresight')) {
        continue
      }
      if (presentPlayer.commandTokens.strategy <= 0) {
        continue
      }

      // Must have ships in the system
      const ownShips = systemUnits.space.filter(u => u.owner === presentPlayer.name)
      if (ownShips.length === 0) {
        continue
      }

      // Find adjacent systems without this player's command tokens
      const adjacentSystems = this.game._getAdjacentSystems(systemId)
        .filter(adjId => {
          const tokens = this.state.systems[adjId]?.commandTokens || []
          return !tokens.includes(presentPlayer.name)
        })

      if (adjacentSystems.length === 0) {
        continue
      }

      const choices = ['Pass', ...adjacentSystems]
      const selection = this.actions.choose(presentPlayer, choices, {
        title: 'Foresight: Place token and move 1 ship to adjacent system?',
      })

      if (selection[0] === 'Pass') {
        continue
      }

      const targetSystem = selection[0]

      // Spend 1 strategy token
      presentPlayer.commandTokens.strategy -= 1

      // Place command token in target system
      if (!this.state.systems[targetSystem]) {
        this.state.systems[targetSystem] = { commandTokens: [] }
      }
      this.state.systems[targetSystem].commandTokens.push(presentPlayer.name)

      // Choose which ship to move
      const shipTypes = [...new Set(ownShips.map(u => u.type))]
      let shipToMove
      if (shipTypes.length === 1) {
        shipToMove = shipTypes[0]
      }
      else {
        const shipChoice = this.actions.choose(presentPlayer, shipTypes, {
          title: 'Choose ship to move',
        })
        shipToMove = shipChoice[0]
      }

      // Move the ship
      const shipIdx = systemUnits.space.findIndex(
        u => u.owner === presentPlayer.name && u.type === shipToMove
      )
      if (shipIdx !== -1) {
        const [ship] = systemUnits.space.splice(shipIdx, 1)
        if (!this.state.units[targetSystem]) {
          this.state.units[targetSystem] = { space: [], planets: {} }
        }
        this.state.units[targetSystem].space.push(ship)
      }

      this.log.add({
        template: '{player} uses Foresight: moves {ship} to {system}',
        args: { player: presentPlayer, ship: shipToMove, system: targetSystem },
      })
    }
  }


  // ---------------------------------------------------------------------------
  // F. Transaction Triggers — called after trade completes
  // ---------------------------------------------------------------------------

  onTransactionComplete(transactionPlayer) {
    this._mentakPillage(transactionPlayer)
  }

  _mentakPillage(transactionPlayer) {
    // Find any Mentak player who is a neighbor of the transaction player
    for (const mentakCandidate of this.players.all()) {
      if (mentakCandidate.name === transactionPlayer.name) {
        continue
      }
      if (!this._hasAbility(mentakCandidate, 'pillage')) {
        continue
      }
      if (!this.game.areNeighbors(mentakCandidate.name, transactionPlayer.name)) {
        continue
      }

      // Transaction player must have trade goods or commodities to steal
      if (transactionPlayer.tradeGoods <= 0 && transactionPlayer.commodities <= 0) {
        continue
      }

      const choices = ['Pass']
      if (transactionPlayer.tradeGoods > 0) {
        choices.unshift('Steal Trade Good')
      }
      if (transactionPlayer.commodities > 0) {
        choices.unshift('Steal Commodity')
      }

      const selection = this.actions.choose(mentakCandidate, choices, {
        title: `Pillage ${transactionPlayer.name}?`,
      })

      if (selection[0] === 'Steal Trade Good') {
        transactionPlayer.spendTradeGoods(1)
        mentakCandidate.addTradeGoods(1)
        this.log.add({
          template: '{mentak} pillages 1 trade good from {target}',
          args: { mentak: mentakCandidate, target: transactionPlayer },
        })
      }
      else if (selection[0] === 'Steal Commodity') {
        transactionPlayer.commodities -= 1
        mentakCandidate.addTradeGoods(1)  // commodities become TG
        this.log.add({
          template: '{mentak} pillages 1 commodity from {target}',
          args: { mentak: mentakCandidate, target: transactionPlayer },
        })
      }
    }
  }


  // ---------------------------------------------------------------------------
  // G. Ground Combat Triggers
  // ---------------------------------------------------------------------------

  onGroundCombatStart(systemId, planetId, attackerName, defenderName) {
    this._yinIndoctrination(systemId, planetId, attackerName, defenderName)
  }

  onGroundCombatRoundEnd(systemId, planetId, attackerName, defenderName) {
    this._l1z1xHarrow(systemId, planetId, attackerName, defenderName)
  }

  _yinIndoctrination(systemId, planetId, attackerName, defenderName) {
    const planetUnits = this.state.units[systemId].planets[planetId]

    for (const [self, opponent] of [[attackerName, defenderName], [defenderName, attackerName]]) {
      const player = this.players.byName(self)
      if (!this._hasAbility(player, 'indoctrination')) {
        continue
      }

      // Check opponent has infantry on the planet
      const enemyInfantry = planetUnits.filter(u => u.owner === opponent && u.type === 'infantry')
      if (enemyInfantry.length === 0) {
        continue
      }

      // Check player can pay 2 influence
      if (player.getTotalInfluence() < 2) {
        continue
      }

      const choice = this.actions.choose(player, ['Indoctrinate', 'Pass'], {
        title: 'Indoctrination: Spend 2 influence to replace 1 enemy infantry?',
      })

      if (choice[0] === 'Pass') {
        continue
      }

      // Pay 2 influence
      this.game._payInfluence(player, 2)

      // Remove 1 enemy infantry
      const idx = planetUnits.findIndex(u => u.owner === opponent && u.type === 'infantry')
      if (idx !== -1) {
        planetUnits.splice(idx, 1)
      }

      // Add 1 own infantry
      this.game._addUnitToPlanet(systemId, planetId, 'infantry', self)

      this.log.add({
        template: '{player} uses Indoctrination: replaces 1 enemy infantry',
        args: { player },
      })
    }
  }

  _l1z1xHarrow(systemId, planetId, attackerName, defenderName) {
    for (const [self, opponent] of [[attackerName, defenderName], [defenderName, attackerName]]) {
      const player = this.players.byName(self)
      if (!this._hasAbility(player, 'harrow')) {
        continue
      }

      // Find non-fighter ships in space with bombardment ability
      const systemUnits = this.state.units[systemId]
      const bombardShips = systemUnits.space.filter(u => {
        if (u.owner !== self || u.type === 'fighter') {
          return false
        }
        const stats = this.game._getUnitStats(u.owner, u.type)
        return stats?.abilities?.some(a => a.startsWith('bombardment-'))
      })

      if (bombardShips.length === 0) {
        continue
      }

      // Roll bombardment for each ship (format: 'bombardment-NxD')
      let totalHits = 0
      for (const ship of bombardShips) {
        const stats = this.game._getUnitStats(ship.owner, ship.type)
        const bombAbility = stats.abilities.find(a => a.startsWith('bombardment-'))
        if (!bombAbility) {
          continue
        }
        const parts = bombAbility.replace('bombardment-', '').split('x')
        const combatValue = parseInt(parts[0])
        const diceCount = parseInt(parts[1])
        for (let i = 0; i < diceCount; i++) {
          const roll = Math.floor(this.game.random() * 10) + 1
          if (roll >= combatValue) {
            totalHits++
          }
        }
      }

      if (totalHits === 0) {
        continue
      }

      // Destroy enemy infantry on the planet
      const planetUnits = this.state.units[systemId].planets[planetId]
      let hits = totalHits
      while (hits > 0) {
        const idx = planetUnits.findIndex(u => u.owner === opponent && u.type === 'infantry')
        if (idx === -1) {
          break
        }
        planetUnits.splice(idx, 1)
        hits--
      }

      this.log.add({
        template: '{player} Harrow bombardment: {hits} hits on {planet}',
        args: { player, hits: totalHits, planet: planetId },
      })
    }
  }


  // ---------------------------------------------------------------------------
  // H. Planet Gained Triggers
  // ---------------------------------------------------------------------------

  onPlanetGained(playerName, planetId, systemId, structureCounts) {
    this._saarScavenge(playerName)
    this._l1z1xAssimilate(playerName, planetId, systemId, structureCounts || {})
    this._winnuReclamation(playerName, planetId, systemId)
  }

  _saarScavenge(playerName) {
    const player = this.players.byName(playerName)
    if (!this._hasAbility(player, 'scavenge')) {
      return
    }

    player.addTradeGoods(1)
    this.log.add({
      template: '{player} gains 1 trade good (Scavenge)',
      args: { player },
    })
  }

  _l1z1xAssimilate(playerName, planetId, systemId, structureCounts) {
    const player = this.players.byName(playerName)
    if (!this._hasAbility(player, 'assimilate')) {
      return
    }

    // Replace structures that were removed
    let placed = false
    for (const [unitType, count] of Object.entries(structureCounts)) {
      if (unitType === 'pds' || unitType === 'space-dock') {
        for (let i = 0; i < count; i++) {
          this.game._addUnitToPlanet(systemId, planetId, unitType, playerName)
          placed = true
        }
      }
    }

    if (placed) {
      this.log.add({
        template: '{player} assimilates structures on {planet}',
        args: { player, planet: planetId },
      })
    }
  }

  _winnuReclamation(playerName, planetId, systemId) {
    const player = this.players.byName(playerName)
    if (!this._hasAbility(player, 'reclamation')) {
      return
    }

    if (planetId !== 'mecatol-rex') {
      return
    }

    // Place 1 PDS and 1 space dock on Mecatol Rex
    this.game._addUnitToPlanet(systemId, planetId, 'pds', playerName)
    this.game._addUnitToPlanet(systemId, planetId, 'space-dock', playerName)

    this.log.add({
      template: '{player} uses Reclamation: PDS and space dock on Mecatol Rex',
      args: { player },
    })
  }


  // ---------------------------------------------------------------------------
  // I. Status Phase Triggers
  // ---------------------------------------------------------------------------

  onStatusPhaseStart(player) {
    this._arborecMitosis(player)
  }

  _arborecMitosis(player) {
    if (!this._hasAbility(player, 'mitosis')) {
      return
    }

    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length === 0) {
      return
    }

    const choices = ['Pass', ...controlledPlanets]
    const selection = this.actions.choose(player, choices, {
      title: 'Mitosis: Place 1 infantry on a planet you control?',
    })

    if (selection[0] === 'Pass') {
      return
    }

    const targetPlanet = selection[0]
    const systemId = this.game._findSystemForPlanet(targetPlanet)
    if (systemId) {
      this.game._addUnitToPlanet(systemId, targetPlanet, 'infantry', player.name)
      this.log.add({
        template: '{player} uses Mitosis: 1 infantry on {planet}',
        args: { player, planet: targetPlanet },
      })
    }
  }


  // ---------------------------------------------------------------------------
  // J. Diplomacy Triggers
  // ---------------------------------------------------------------------------

  afterDiplomacyResolved(player) {
    this._xxchaPeaceAccords(player)
  }

  _xxchaPeaceAccords(player) {
    if (!this._hasAbility(player, 'peace-accords')) {
      return
    }

    // Find planets adjacent to player's controlled planets
    const controlledPlanets = player.getControlledPlanets()
    const adjacentPlanets = new Set()

    for (const planetId of controlledPlanets) {
      const systemId = this.game._findSystemForPlanet(planetId)
      if (!systemId) {
        continue
      }

      const adjacentSystems = this.game._getAdjacentSystems(systemId)
      for (const adjSystemId of adjacentSystems) {
        const tile = res.getSystemTile(adjSystemId) || res.getSystemTile(Number(adjSystemId))
        if (!tile) {
          continue
        }
        for (const adjPlanetId of tile.planets) {
          // Must not be controlled by this player
          if (this.state.planets[adjPlanetId]?.controller === player.name) {
            continue
          }
          // Must have no units on it
          const planetUnits = this.state.units[adjSystemId]?.planets[adjPlanetId] || []
          if (planetUnits.length > 0) {
            continue
          }
          adjacentPlanets.add(adjPlanetId)
        }
      }
    }

    if (adjacentPlanets.size === 0) {
      return
    }

    const choices = ['Pass', ...adjacentPlanets]
    const selection = this.actions.choose(player, choices, {
      title: 'Peace Accords: Gain control of an unoccupied adjacent planet?',
    })

    if (selection[0] === 'Pass') {
      return
    }

    const targetPlanet = selection[0]
    const targetSystemId = this.game._findSystemForPlanet(targetPlanet)
    if (targetSystemId) {
      this.state.planets[targetPlanet].controller = player.name
      this.state.planets[targetPlanet].exhausted = true

      this.log.add({
        template: '{player} uses Peace Accords: gains control of {planet}',
        args: { player, planet: targetPlanet },
      })
    }
  }


  // ---------------------------------------------------------------------------
  // K. Agenda Triggers
  // ---------------------------------------------------------------------------

  onAgendaRevealed(agenda) {
    return this._xxchaQuash(agenda)
  }

  onAgendaVotingStart(agenda, outcomes) {
    this._nekroPrediction(agenda, outcomes)
  }

  getAgendaParticipation(votingOrder) {
    const excluded = []
    let order = [...votingOrder]

    // Nekro galactic-threat: cannot vote
    for (const player of votingOrder) {
      if (this._hasAbility(player, 'galactic-threat')) {
        excluded.push(player.name)
      }
    }

    // Argent zeal: always vote first
    const argentIdx = order.findIndex(p => this._hasAbility(p, 'zeal'))
    if (argentIdx > 0) {
      const [argent] = order.splice(argentIdx, 1)
      order.unshift(argent)
    }

    return { order, excluded }
  }

  getVotingModifier(player) {
    // Argent zeal: +1 vote per player in the game
    if (this._hasAbility(player, 'zeal')) {
      return this.players.all().length
    }
    return 0
  }

  onAgendaOutcomeResolved(agenda, winningOutcome, playerVotes) {
    this._nekroOutcomeReward(winningOutcome)
    this._nomadFutureSight(winningOutcome, playerVotes)
  }

  _xxchaQuash(agenda) {
    for (const player of this.players.all()) {
      if (!this._hasAbility(player, 'quash')) {
        continue
      }
      if (player.commandTokens.strategy < 1) {
        continue
      }

      const choice = this.actions.choose(player, ['Quash', 'Pass'], {
        title: `Quash agenda "${agenda.name}"? (Spend 1 strategy token)`,
      })

      if (choice[0] === 'Quash') {
        player.commandTokens.strategy -= 1

        this.log.add({
          template: '{player} uses Quash: discards agenda',
          args: { player },
        })

        // Draw replacement agenda
        const replacement = this.game._drawAgendaCard()
        return replacement
      }
    }

    return null
  }


  // ---------------------------------------------------------------------------
  // L. Creuss Abilities — Wormhole mastery
  // ---------------------------------------------------------------------------

  getHomeSystemWormholes(systemId) {
    for (const player of this.players.all()) {
      if (!this._hasAbility(player, 'quantum-entanglement')) {
        continue
      }
      if (String(systemId) === String(player.faction?.homeSystem)) {
        return ['alpha', 'beta']
      }
    }
    return []
  }

  getMovementBonus(playerName, fromSystemId) {
    const player = this.players.byName(playerName)
    if (!player || !this._hasAbility(player, 'slipstream')) {
      return 0
    }

    // Check if fromSystem has alpha or beta wormhole
    const tile = this.game.res.getSystemTile(fromSystemId) ||
      this.game.res.getSystemTile(Number(fromSystemId))
    const wormholes = tile ? [...tile.wormholes] : []

    // Also check faction wormholes
    const factionWormholes = this.getHomeSystemWormholes(fromSystemId)
    for (const w of factionWormholes) {
      if (!wormholes.includes(w)) {
        wormholes.push(w)
      }
    }

    if (wormholes.includes('alpha') || wormholes.includes('beta')) {
      return 1
    }
    return 0
  }


  // ---------------------------------------------------------------------------
  // M. Nekro Virus Abilities — Tech parasites
  // ---------------------------------------------------------------------------

  canResearchNormally(player) {
    if (this._hasAbility(player, 'propagation')) {
      return false
    }
    return true
  }

  _nekroPrediction(agenda, outcomes) {
    for (const player of this.players.all()) {
      if (!this._hasAbility(player, 'galactic-threat')) {
        continue
      }

      const choices = outcomes.map(o => `Predict: ${o}`)
      choices.push('No prediction')

      const selection = this.actions.choose(player, choices, {
        title: `Galactic Threat: Predict outcome of "${agenda.name}"`,
      })

      if (selection[0] !== 'No prediction') {
        const predicted = selection[0].replace('Predict: ', '')
        this.state.nekroPrediction = { playerName: player.name, outcome: predicted }

        this.log.add({
          template: '{player} predicts: {outcome} (Galactic Threat)',
          args: { player, outcome: predicted },
        })
      }
    }
  }

  _nekroOutcomeReward(winningOutcome) {
    if (!this.state.nekroPrediction) {
      return
    }

    const { playerName, outcome } = this.state.nekroPrediction
    this.state.nekroPrediction = null

    if (outcome !== winningOutcome) {
      return
    }

    const player = this.players.byName(playerName)
    if (!player) {
      return
    }

    // Correct prediction: gain 1 tech from any player
    const allTechs = []
    for (const other of this.players.all()) {
      if (other.name === playerName) {
        continue
      }
      for (const techId of other.getTechIds()) {
        if (!player.hasTechnology(techId)) {
          allTechs.push(techId)
        }
      }
    }

    const unique = [...new Set(allTechs)]
    if (unique.length === 0) {
      return
    }

    const selection = this.actions.choose(player, unique, {
      title: 'Galactic Threat: Correct prediction — choose technology to copy',
    })

    const techId = selection[0]
    this.game._grantTechnology(player, techId)

    this.log.add({
      template: '{player} gains {tech} (correct Galactic Threat prediction)',
      args: { player, tech: techId },
    })
  }

  onUnitDestroyed(systemId, unit, destroyerName) {
    this._nekroSingularity(systemId, unit, destroyerName)
    this._cabalDevour(systemId, unit, destroyerName)
  }

  _nekroSingularity(systemId, unit, destroyerName) {
    const player = this.players.byName(destroyerName)
    if (!player || !this._hasAbility(player, 'technological-singularity')) {
      return
    }

    // Once per combat
    if (this.state._singularityUsedThisCombat) {
      return
    }

    const owner = this.players.byName(unit.owner)
    if (!owner) {
      return
    }

    const ownerTechs = owner.getTechIds().filter(id => !player.hasTechnology(id))
    if (ownerTechs.length === 0) {
      return
    }

    const choices = ['Pass', ...ownerTechs]
    const selection = this.actions.choose(player, choices, {
      title: `Technological Singularity: Copy a technology from ${unit.owner}?`,
    })

    if (selection[0] === 'Pass') {
      return
    }

    this.state._singularityUsedThisCombat = true
    const techId = selection[0]
    this.game._grantTechnology(player, techId)

    this.log.add({
      template: '{player} copies {tech} from {target} (Technological Singularity)',
      args: { player, tech: techId, target: unit.owner },
    })
  }


  // ---------------------------------------------------------------------------
  // N. Argent Flight Abilities — Military precision
  // ---------------------------------------------------------------------------

  getRaidFormationExcessHits(shooterName, totalHits, fightersDestroyed) {
    const player = this.players.byName(shooterName)
    if (!player || !this._hasAbility(player, 'raid-formation')) {
      return 0
    }
    return Math.max(0, totalHits - fightersDestroyed)
  }


  // ---------------------------------------------------------------------------
  // O. Empyrean Abilities — Nebula traversal
  // ---------------------------------------------------------------------------

  canMoveThroughNebulae(playerName) {
    const player = this.players.byName(playerName)
    return player ? this._hasAbility(player, 'voidborn') : false
  }


  // ---------------------------------------------------------------------------
  // P. Mahact Gene-Sorcerers Abilities — Token capture
  // ---------------------------------------------------------------------------

  afterCombatResolved(systemId, winnerName, loserName, _combatType) {
    this._mahactEdict(winnerName, loserName)
    // Reset singularity tracking
    delete this.state._singularityUsedThisCombat
  }

  _mahactEdict(winnerName, loserName) {
    const winner = this.players.byName(winnerName)
    if (!winner || !this._hasAbility(winner, 'edict')) {
      return
    }

    if (!this.state.capturedCommandTokens[winnerName]) {
      this.state.capturedCommandTokens[winnerName] = []
    }
    this.state.capturedCommandTokens[winnerName].push(loserName)

    this.log.add({
      template: '{player} captures {loser} command token (Edict)',
      args: { player: winner, loser: loserName },
    })
  }

  getCapturedTokenFleetBonus(player) {
    if (!this._hasAbility(player, 'edict')) {
      return 0
    }
    return (this.state.capturedCommandTokens[player.name] || []).length
  }


  // ---------------------------------------------------------------------------
  // Q. Naaz-Rokha Alliance Abilities — Exploration + fragments
  // ---------------------------------------------------------------------------

  getExplorationBonus(player, planetId) {
    if (!this._hasAbility(player, 'distant-suns')) {
      return 0
    }

    // Check if player has a mech on this planet
    const systemId = this.game._findSystemForPlanet(planetId)
    if (!systemId) {
      return 0
    }

    const planetUnits = this.state.units[systemId]?.planets[planetId] || []
    const hasMech = planetUnits.some(u => u.owner === player.name && u.type === 'mech')
    return hasMech ? 1 : 0
  }

  _fabrication(player) {
    const fragments = player.relicFragments || []
    if (fragments.length === 0) {
      return
    }

    const choices = []
    // Check if player has 2 of the same type
    const counts = {}
    for (const f of fragments) {
      counts[f] = (counts[f] || 0) + 1
    }
    const hasPair = Object.values(counts).some(c => c >= 2)

    if (hasPair) {
      choices.push('Purge 2 fragments for relic')
    }
    choices.push('Purge 1 fragment for command token')

    const selection = this.actions.choose(player, choices, {
      title: 'Fabrication: Choose action',
    })

    if (selection[0] === 'Purge 1 fragment for command token') {
      // Choose which fragment to purge
      const uniqueTypes = [...new Set(fragments)]
      let fragType
      if (uniqueTypes.length === 1) {
        fragType = uniqueTypes[0]
      }
      else {
        const fragSelection = this.actions.choose(player, uniqueTypes, {
          title: 'Choose fragment type to purge',
        })
        fragType = fragSelection[0]
      }

      const idx = player.relicFragments.indexOf(fragType)
      if (idx !== -1) {
        player.relicFragments.splice(idx, 1)
      }

      player.commandTokens.tactics += 1

      this.log.add({
        template: '{player} purges 1 {type} fragment for 1 command token (Fabrication)',
        args: { player, type: fragType },
      })
    }
    else if (selection[0] === 'Purge 2 fragments for relic') {
      // Choose which type to purge 2 of
      const pairTypes = Object.entries(counts).filter(([, c]) => c >= 2).map(([t]) => t)
      let fragType
      if (pairTypes.length === 1) {
        fragType = pairTypes[0]
      }
      else {
        const fragSelection = this.actions.choose(player, pairTypes, {
          title: 'Choose fragment type to purge (2)',
        })
        fragType = fragSelection[0]
      }

      // Remove 2 of that type
      for (let i = 0; i < 2; i++) {
        const idx = player.relicFragments.indexOf(fragType)
        if (idx !== -1) {
          player.relicFragments.splice(idx, 1)
        }
      }

      this.log.add({
        template: '{player} purges 2 {type} fragments for a relic (Fabrication)',
        args: { player, type: fragType },
      })
    }
  }


  // ---------------------------------------------------------------------------
  // R. Nomad Abilities — Agenda rewards
  // ---------------------------------------------------------------------------

  _nomadFutureSight(winningOutcome, playerVotes) {
    for (const player of this.players.all()) {
      if (!this._hasAbility(player, 'future-sight')) {
        continue
      }

      const vote = playerVotes[player.name]
      if (vote && vote.outcome === winningOutcome) {
        player.addTradeGoods(1)
        this.log.add({
          template: '{player} gains 1 trade good (Future Sight)',
          args: { player },
        })
      }
    }
  }


  // ---------------------------------------------------------------------------
  // S. Titans of Ul Abilities — Sleeper tokens
  // ---------------------------------------------------------------------------

  afterExploration(player, planetId, _systemId) {
    this._titansTerragenesis(player, planetId)
  }

  _titansTerragenesis(player, planetId) {
    if (!this._hasAbility(player, 'terragenesis')) {
      return
    }

    // Cannot place if sleeper already exists on this planet
    if (this.state.sleeperTokens[planetId]) {
      return
    }

    const choices = ['Place sleeper', 'Pass']
    const selection = this.actions.choose(player, choices, {
      title: `Terragenesis: Place a sleeper token on ${planetId}?`,
    })

    if (selection[0] === 'Place sleeper') {
      this.state.sleeperTokens[planetId] = player.name

      this.log.add({
        template: '{player} places a sleeper token on {planet} (Terragenesis)',
        args: { player, planet: planetId },
      })
    }
  }

  onSystemActivated(playerName, systemId) {
    this._titansAwaken(playerName, systemId)
  }

  _titansAwaken(playerName, systemId) {
    const player = this.players.byName(playerName)
    if (!player || !this._hasAbility(player, 'awaken')) {
      return
    }

    // Check all planets in system for sleeper tokens owned by this player
    const tile = this.game.res.getSystemTile(systemId) ||
      this.game.res.getSystemTile(Number(systemId))
    if (!tile) {
      return
    }

    for (const planetId of tile.planets) {
      if (this.state.sleeperTokens[planetId] !== playerName) {
        continue
      }

      // Replace sleeper with PDS
      delete this.state.sleeperTokens[planetId]
      this.game._addUnitToPlanet(systemId, planetId, 'pds', playerName)

      this.log.add({
        template: '{player} awakens sleeper on {planet}: PDS deployed (Awaken)',
        args: { player, planet: planetId },
      })
    }
  }


  // ---------------------------------------------------------------------------
  // T. Vuil'raith Cabal Abilities — Unit capture
  // ---------------------------------------------------------------------------

  _cabalDevour(systemId, unit, destroyerName) {
    const player = this.players.byName(destroyerName)
    if (!player || !this._hasAbility(player, 'devour')) {
      return
    }

    // Only capture non-structure units
    const unitDef = this.game.res.getUnit(unit.type)
    if (!unitDef || unitDef.category === 'structure') {
      return
    }

    if (!this.state.capturedUnits[destroyerName]) {
      this.state.capturedUnits[destroyerName] = []
    }

    this.state.capturedUnits[destroyerName].push({
      type: unit.type,
      originalOwner: unit.owner,
    })

    this.log.add({
      template: '{player} captures {type} from {owner} (Devour)',
      args: { player, type: unit.type, owner: unit.owner },
    })
  }

  _amalgamation(player) {
    const captured = this.state.capturedUnits[player.name] || []
    if (captured.length === 0) {
      return
    }

    const choices = captured.map(c => `${c.type} (from ${c.originalOwner})`)
    const selection = this.actions.choose(player, choices, {
      title: 'Amalgamation: Choose captured unit to return',
    })

    const idx = choices.indexOf(selection[0])
    if (idx === -1) {
      return
    }

    const removed = captured.splice(idx, 1)[0]

    // Find a system with player's units
    const validSystems = []
    for (const [sysId, sysUnits] of Object.entries(this.state.units)) {
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
      const sysSelection = this.actions.choose(player, validSystems, {
        title: 'Choose system to place unit',
      })
      targetSystem = sysSelection[0]
    }

    this.game._addUnit(targetSystem, 'space', removed.type, player.name)

    this.log.add({
      template: '{player} uses Amalgamation: places {type} in system {system}',
      args: { player, type: removed.type, system: targetSystem },
    })
  }

  _riftmeld(player) {
    const captured = this.state.capturedUnits[player.name] || []
    if (captured.length === 0) {
      return
    }

    const choices = captured.map(c => `${c.type} (from ${c.originalOwner})`)
    const selection = this.actions.choose(player, choices, {
      title: 'Riftmeld: Choose captured unit to return',
    })

    const idx = choices.indexOf(selection[0])
    if (idx === -1) {
      return
    }

    captured.splice(idx, 1)

    // Research 1 unit upgrade tech, ignoring prerequisites
    const allTechs = [...this.game.res.getGenericTechnologies()]
    if (player.faction?.factionTechnologies) {
      allTechs.push(...player.faction.factionTechnologies)
    }
    const unitUpgrades = allTechs
      .filter(t => t.unitUpgrade && !player.hasTechnology(t.id))
      .map(t => t.id)

    if (unitUpgrades.length === 0) {
      return
    }

    const techSelection = this.actions.choose(player, unitUpgrades, {
      title: 'Riftmeld: Research unit upgrade (ignoring prerequisites)',
    })

    const techId = techSelection[0]
    this.game._grantTechnology(player, techId)

    this.log.add({
      template: '{player} uses Riftmeld: researches {tech}',
      args: { player, tech: techId },
    })
  }


  // ---------------------------------------------------------------------------
  // U. Council Keleres Abilities — Economic
  // ---------------------------------------------------------------------------

  onStrategyPhaseStart(player) {
    this._keleresPatronage(player)
  }

  _keleresPatronage(player) {
    if (!this._hasAbility(player, 'council-patronage')) {
      return
    }

    player.replenishCommodities()
    player.addTradeGoods(1)

    this.log.add({
      template: '{player} replenishes commodities and gains 1 TG (Council Patronage)',
      args: { player },
    })
  }
}


module.exports = { FactionAbilities }
