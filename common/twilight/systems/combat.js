const res = require('../res/index.js')

// Snapshot roll data to plain objects (strips live unit refs)
function _mapRolls(rollResult) {
  return rollResult.rolls.map(r => ({
    unitType: r.ship.type,
    unitId: r.ship.id,
    owner: r.ship.owner,
    effectiveCombat: r.effectiveCombat,
    dice: r.diceResults.map(d => ({ roll: d.roll, hit: d.hit })),
  }))
}

module.exports = function(Twilight) {

  ////////////////////////////////////////////////////////////////////////////////
  // Space Combat

  Twilight.prototype._spaceCombat = function(player, systemId) {
    const systemUnits = this.state.units[systemId]
    if (!systemUnits) {
      return
    }

    // Find all players with ships in the system
    const playerShips = {}
    for (const unit of systemUnits.space) {
      if (!playerShips[unit.owner]) {
        playerShips[unit.owner] = []
      }
      playerShips[unit.owner].push(unit)
    }

    // Need exactly 2 players with ships for combat
    const combatants = Object.keys(playerShips)
    if (combatants.length < 2) {
      return
    }

    const attacker = player.name
    const defender = combatants.find(name => name !== attacker)
    if (!defender) {
      return
    }

    this.log.add({
      template: 'Space combat in system {system}',
      args: { system: systemId },
      event: 'combat',
    })
    if (!this.state._combatLog) {
      this.state._combatLog = []
    }
    this.state._combatLog.push({
      type: 'space-combat-start',
      systemId,
      attacker,
      defender,
    })
    this.state.currentCombat = { systemId, type: 'space', step: 'afb' }
    this.log.indent()

    // Mentak Ambush (before AFB)
    this.factionAbilities.onSpaceCombatStart(systemId, attacker, defender)

    // Anti-Fighter Barrage (before combat)
    this._antiFighterBarrage(systemId, attacker, defender)

    // Assault Cannon: if a player has 3+ non-fighter ships and this tech, opponent destroys 1 non-fighter
    for (const [acOwner, acTarget] of [[attacker, defender], [defender, attacker]]) {
      const acPlayer = this.players.byName(acOwner)
      if (acPlayer && acPlayer.hasTechnology('assault-cannon')) {
        const ownShips = systemUnits.space.filter(
          u => u.owner === acOwner && u.type !== 'fighter'
        )
        if (ownShips.length >= 3) {
          const targetShips = systemUnits.space.filter(
            u => u.owner === acTarget && u.type !== 'fighter'
          )
          if (targetShips.length > 0) {
          // Destroy cheapest non-fighter
            targetShips.sort((a, b) => {
              const defA = this._getUnitStats(a.owner, a.type)
              const defB = this._getUnitStats(b.owner, b.type)
              return (defA?.cost || 0) - (defB?.cost || 0)
            })
            const victim = targetShips[0]
            const idx = systemUnits.space.findIndex(u => u.id === victim.id)
            if (idx !== -1) {
              const removed = systemUnits.space.splice(idx, 1)[0]
              this.log.add({
                template: 'Assault Cannon: {target} loses a {unit}',
                args: { target: acTarget, unit: victim.type },
              })
              this.factionAbilities.onUnitDestroyed(systemId, removed, acOwner, null)
            }
          }
        }
      }
    }

    // Combat rounds
    let round = 0
    let retreatedPlayer = null
    const MAX_ROUNDS = 20  // safety limit
    this.state.currentCombat.step = 'combat-round'
    while (round < MAX_ROUNDS) {
      round++
      this.state.currentCombat.round = round

      const attackerShips = systemUnits.space.filter(u => u.owner === attacker)
      const defenderShips = systemUnits.space.filter(u => u.owner === defender)

      if (attackerShips.length === 0 || defenderShips.length === 0) {
        break
      }

      // Start-of-round faction abilities (e.g., Letnev Munitions Reserves)
      this.factionAbilities.onSpaceCombatRound(systemId, attacker, defender)

      // Both sides roll simultaneously
      this.state._combatOpponent = { [attacker]: defender, [defender]: attacker }
      const combatContext = { combatType: 'space', systemId }
      const attackerRoll = this._rollCombatDice(attackerShips, combatContext)
      const defenderContext = { ...combatContext, isDefender: true }
      const defenderRoll = this._rollCombatDice(defenderShips, defenderContext)
      delete this.state._combatOpponent

      // War Funding (Barony of Letnev PN): reroll opponent's dice and/or own dice
      this._offerWarFunding(attacker, defender, attackerRoll, defenderRoll)

      // Crown of Thalnos: reroll missed dice (+1), destroy units that still miss
      let attackerHits = attackerRoll.hits + this._offerCrownOfThalnos(attacker, attackerRoll, combatContext)
      let defenderHits = defenderRoll.hits + this._offerCrownOfThalnos(defender, defenderRoll, combatContext)

      this.state._combatLog.push({
        type: 'combat-round',
        combatType: 'space',
        systemId,
        round,
        sides: {
          attacker: { name: attacker, rolls: _mapRolls(attackerRoll), totalHits: attackerHits },
          defender: { name: defender, rolls: _mapRolls(defenderRoll), totalHits: defenderHits },
        },
      })

      this.log.add({
        template: 'Round {round}: attacker scores {aHits} hits, defender scores {dHits} hits',
        args: { round, aHits: attackerHits, dHits: defenderHits },
      })

      // Assign hits (auto-assign: sustain damage first, then cheapest units)
      this.state.currentCombat.step = 'assign-hits'
      this._assignHits(systemId, defender, attackerHits, attacker)
      this._assignHits(systemId, attacker, defenderHits, defender)

      // Post-round faction abilities (e.g., Yin Devotion)
      this.factionAbilities.afterSpaceCombatRound(systemId, attacker, defender)

      // Check if either side wants to retreat (only after first round)
      this.state.currentCombat.step = 'retreat'
      if (round >= 1) {
      // Check for pending retreat announcements
        const defenderRetreating = this.state.retreatAnnounced?.[defender]
        const attackerRetreating = this.state.retreatAnnounced?.[attacker]

        if (defenderRetreating) {
          this._executeRetreat(systemId, defender, defenderRetreating)
          delete this.state.retreatAnnounced[defender]
          retreatedPlayer = defender
          break
        }
        if (attackerRetreating) {
          this._executeRetreat(systemId, attacker, attackerRetreating)
          delete this.state.retreatAnnounced[attacker]
          retreatedPlayer = attacker
          break
        }
      }
    }

    // Determine combat winner/loser for faction abilities (Mahact edict)
    const aShipsAfter = systemUnits.space.filter(u => u.owner === attacker)
    const dShipsAfter = systemUnits.space.filter(u => u.owner === defender)

    const spaceWinner = aShipsAfter.length > 0 && dShipsAfter.length === 0 ? attacker
      : dShipsAfter.length > 0 && aShipsAfter.length === 0 ? defender
        : null
    this.state._combatLog.push({
      type: 'combat-end',
      combatType: 'space',
      systemId,
      winner: spaceWinner,
      loser: spaceWinner ? (spaceWinner === attacker ? defender : attacker) : null,
      retreated: retreatedPlayer,
    })

    if (aShipsAfter.length > 0 && dShipsAfter.length === 0) {
      this.factionAbilities.afterCombatResolved(systemId, attacker, defender, 'space')
      this._detectCombatSecrets(systemId, attacker, defender, 'space')
    }
    else if (dShipsAfter.length > 0 && aShipsAfter.length === 0) {
      this.factionAbilities.afterCombatResolved(systemId, defender, attacker, 'space')
      this._detectCombatSecrets(systemId, defender, attacker, 'space')
    }

    delete this.state.currentCombat
    this.log.outdent()
  }

  // Announce retreat: called from action cards or before combat round
  Twilight.prototype.announceRetreat = function(playerName, targetSystemId) {
    if (!this.state.retreatAnnounced) {
      this.state.retreatAnnounced = {}
    }
    this.state.retreatAnnounced[playerName] = targetSystemId
  }

  Twilight.prototype._executeRetreat = function(fromSystemId, playerName, toSystemId) {
    const fromUnits = this.state.units[fromSystemId]

    // Ensure target system unit structure exists
    if (!this.state.units[toSystemId]) {
      this.state.units[toSystemId] = { space: [], planets: {} }
    }

    // Move all ships belonging to this player
    const ships = fromUnits.space.filter(u => u.owner === playerName)
    fromUnits.space = fromUnits.space.filter(u => u.owner !== playerName)

    for (const ship of ships) {
      this.state.units[toSystemId].space.push(ship)
    }

    this.log.add({
      template: '{player} retreats to {system}',
      args: { player: playerName, system: toSystemId },
    })
  }

  Twilight.prototype._getRetreatTargets = function(systemId, playerName) {
    const adjacentSystems = this._getAdjacentSystems(systemId)
    return adjacentSystems.filter(adjId => {
      const adjUnits = this.state.units[adjId]
      if (!adjUnits) {
        return true
      }
      // Cannot retreat into a system with enemy ships
      return !adjUnits.space.some(u => u.owner !== playerName)
    })
  }


  Twilight.prototype._antiFighterBarrage = function(systemId, attacker, defender) {
    const systemUnits = this.state.units[systemId]

    // Both sides can have AFB
    for (const [shooter, target] of [[attacker, defender], [defender, attacker]]) {
      const ships = systemUnits.space.filter(u => u.owner === shooter)
      let totalAFBHits = 0
      const afbMissCombatValues = []

      // Strike Wing Alpha II: track rolls of 9-10 from destroyers with this upgrade
      let swaIIInfantryKills = 0
      const shooterPlayer = this.players.byName(shooter)
      const hasSWAII = shooterPlayer && shooterPlayer.hasTechnology('strike-wing-alpha-ii')

      // Commander bonus: +N dice to the first unit that fires (e.g., Argent Commander)
      let commanderBonusDice = this.factionAbilities.getUnitAbilityBonusDice(shooter)
      const allRolls = []
      const combatValuesUsed = new Set()
      let hadCommanderBonus = false

      for (const ship of ships) {
        const unitDef = this._getUnitStats(ship.owner, ship.type)
        if (!unitDef) {
          continue
        }

        // The Cavalry: use override abilities if active for this ship
        const effectiveAbilities = (this.state._cavalryActive?.unitId === ship.id)
          ? this.state._cavalryActive.abilities
          : unitDef.abilities

        // Parse AFB ability: 'anti-fighter-barrage-Nx#' where N is combat value, # is dice count
        const afbAbility = effectiveAbilities.find(a => a.startsWith('anti-fighter-barrage-'))
        if (!afbAbility) {
          continue
        }

        const parts = afbAbility.replace('anti-fighter-barrage-', '').split('x')
        const combatValue = parseInt(parts[0])
        let diceCount = parseInt(parts[1])

        // Apply commander bonus dice to the first unit that fires
        if (commanderBonusDice > 0) {
          diceCount += commanderBonusDice
          commanderBonusDice = 0
          hadCommanderBonus = true
        }

        combatValuesUsed.add(combatValue)
        for (let i = 0; i < diceCount; i++) {
          const roll = Math.floor(this.random() * 10) + 1
          allRolls.push(roll)
          if (roll >= combatValue) {
            totalAFBHits++
            // Strike Wing Alpha II: results of 9 or 10 also destroy infantry
            if (hasSWAII && ship.type === 'destroyer' && roll >= 9) {
              swaIIInfantryKills++
            }
          }
          else {
            afbMissCombatValues.push(combatValue)
          }
        }
      }

      // Jol-Nar Commander: reroll misses
      totalAFBHits += this._offerUnitAbilityReroll(shooter, afbMissCombatValues)

      // AFB hits only affect fighters
      if (totalAFBHits > 0) {
        this.log.add({
          template: '{shooter} scores {hits} anti-fighter barrage hits',
          args: { shooter, hits: totalAFBHits },
        })
        this.log.indent()
        const afbThresholds = [...combatValuesUsed].sort((a, b) => a - b).map(t => `${t}+`).join('/')
        let afbDetail = `Rolls: ${allRolls.join(', ')} (need ${afbThresholds})`
        if (hadCommanderBonus) {
          afbDetail += ', Commander: +1 die'
        }
        this.log.add({ template: afbDetail, args: {} })
        this.log.outdent()

        let fightersDestroyed = 0
        for (let i = 0; i < totalAFBHits; i++) {
          const fighterIdx = systemUnits.space.findIndex(
            u => u.owner === target && u.type === 'fighter'
          )
          if (fighterIdx !== -1) {
            const removed = systemUnits.space.splice(fighterIdx, 1)[0]
            this.factionAbilities.onUnitDestroyed(systemId, removed, shooter, null)
            fightersDestroyed++
          }
        }

        this.state._combatLog.push({
          type: 'afb',
          systemId,
          shooter,
          target,
          hits: totalAFBHits,
          fightersDestroyed,
        })

        // fight-with-precision: destroyed all fighters during AFB
        if (fightersDestroyed > 0) {
          const remainingFighters = systemUnits.space.filter(
            u => u.owner === target && u.type === 'fighter'
          )
          if (remainingFighters.length === 0) {
            this._recordSecretTrigger(shooter, 'fight-with-precision')
          }
        }

        // Strike Wing Alpha II: destroy opponent infantry in the space area
        if (swaIIInfantryKills > 0) {
          let infantryDestroyed = 0
          for (let i = 0; i < swaIIInfantryKills; i++) {
            const infantryIdx = systemUnits.space.findIndex(
              u => u.owner === target && u.type === 'infantry'
            )
            if (infantryIdx !== -1) {
              const removed = systemUnits.space.splice(infantryIdx, 1)[0]
              this.factionAbilities.onUnitDestroyed(systemId, removed, shooter, null)
              infantryDestroyed++
            }
          }
          if (infantryDestroyed > 0) {
            this.log.add({
              template: 'Strike Wing Alpha II: {shooter} destroys {count} opponent infantry',
              args: { shooter, count: infantryDestroyed },
            })
          }
        }

        // Argent raid-formation: excess AFB hits apply as sustain-damage to opponent ships
        const excessHits = this.factionAbilities.getRaidFormationExcessHits(
          shooter, totalAFBHits, fightersDestroyed
        )
        if (excessHits > 0) {
          let remaining = excessHits
          // Apply sustain damage to opponent ships
          const sustainShips = systemUnits.space
            .filter(u => u.owner === target && !u.damaged)
            .filter(u => {
              const def = this._getUnitStats(u.owner, u.type)
              return def && def.abilities.includes('sustain-damage')
            })
          for (const ship of sustainShips) {
            if (remaining <= 0) {
              break
            }
            ship.damaged = true
            remaining--
          }
          if (excessHits > 0) {
            this.log.add({
              template: '{shooter} Raid Formation: {hits} excess hits damage ships',
              args: { shooter, hits: excessHits },
            })
          }
        }
      }
    }
  }

  Twilight.prototype._rollCombatDice = function(ships, context) {
    let hits = 0
    const rolls = []
    for (const ship of ships) {
      const unitDef = this._getUnitStats(ship.owner, ship.type)
      if (!unitDef || !unitDef.combat) {
        continue
      }

      // The Cavalry: override combat value for the chosen ship
      const cavalryOverride = this.state._cavalryActive?.unitId === ship.id
      const combatBase = cavalryOverride ? this.state._cavalryActive.combat : unitDef.combat

      // Faction combat modifiers
      const owner = this.players.byName(ship.owner)
      let combatModifier = this.factionAbilities.getCombatModifier(owner)

      // Space combat-specific modifiers (e.g., Gravleash Maneuvers)
      if (context?.combatType === 'space' && context?.systemId) {
        combatModifier += this.factionAbilities.getSpaceCombatModifier(owner, context.systemId)
      }

      // Nebula: defender gets +1 to combat rolls in space combat (Rule 59.3)
      if (context?.combatType === 'space' && context?.isDefender && context?.systemId) {
        const tile = res.getSystemTile(context.systemId) || res.getSystemTile(Number(context.systemId))
        if (tile?.anomaly === 'nebula') {
          combatModifier -= 1  // negative = bonus (lower threshold = easier to hit)
        }
      }

      // Ground combat per-unit modifiers (e.g., Shield Paling negates Fragile for infantry)
      if (context?.combatType === 'ground' && context?.planetId) {
        combatModifier += this.factionAbilities.getGroundCombatUnitModifier(owner, ship, context.systemId, context.planetId)
      }

      const effectiveCombat = Math.max(1, Math.min(combatBase + combatModifier, 10))

      // Each ship rolls 1 die (war suns roll 3 dice per their combat value)
      // bonusDice: temporary extra dice (e.g., Letnev agent Viscount Unlenn)
      const baseDice = unitDef.type === 'war-sun' ? 3 : 1
      const diceCount = baseDice + (ship.bonusDice || 0)
      const diceResults = []
      for (let i = 0; i < diceCount; i++) {
        const roll = Math.floor(this.random() * 10) + 1
        const hit = roll >= effectiveCombat
        if (hit) {
          hits++
        }
        diceResults.push({ roll, hit })
      }
      rolls.push({ ship, effectiveCombat, diceResults })
    }
    return { hits, rolls }
  }

  // War Funding (Barony of Letnev PN - Omega):
  // "After you and your opponent roll dice during space combat: You may reroll
  //  all of your opponent's dice. You may reroll any number of your dice.
  //  Then, return this card to the Letnev player."
  Twilight.prototype._offerWarFunding = function(attackerName, defenderName, attackerRoll, defenderRoll) {
    const participants = [
      { holderName: attackerName, opponentRoll: defenderRoll, ownRoll: attackerRoll },
      { holderName: defenderName, opponentRoll: attackerRoll, ownRoll: defenderRoll },
    ]

    for (const { holderName, opponentRoll, ownRoll } of participants) {
      const holder = this.players.byName(holderName)
      if (!holder) {
        continue
      }
      const pn = holder.getPromissoryNotes().find(n => n.id === 'war-funding' && n.owner !== holder.name)
      if (!pn) {
        continue
      }

      const choice = this.actions.choose(holder, ['Play War Funding', 'Pass'], {
        title: 'War Funding: Reroll opponent\'s dice and optionally your own?',
      })
      if (choice[0] !== 'Play War Funding') {
        continue
      }

      // Reroll ALL opponent's dice
      let opponentHits = 0
      for (const entry of opponentRoll.rolls) {
        for (let i = 0; i < entry.diceResults.length; i++) {
          const roll = Math.floor(this.random() * 10) + 1
          const hit = roll >= entry.effectiveCombat
          entry.diceResults[i] = { roll, hit }
          if (hit) {
            opponentHits++
          }
        }
      }
      opponentRoll.hits = opponentHits

      // Offer to reroll own dice
      const rerollChoice = this.actions.choose(holder, ['Reroll my dice', 'Keep my dice'], {
        title: 'War Funding: Reroll your own dice too?',
      })
      if (rerollChoice[0] === 'Reroll my dice') {
        let ownHits = 0
        for (const entry of ownRoll.rolls) {
          for (let i = 0; i < entry.diceResults.length; i++) {
            const roll = Math.floor(this.random() * 10) + 1
            const hit = roll >= entry.effectiveCombat
            entry.diceResults[i] = { roll, hit }
            if (hit) {
              ownHits++
            }
          }
        }
        ownRoll.hits = ownHits
      }

      // Return PN to Letnev
      const letnevPlayer = this.players.byName(pn.owner)
      holder.removePromissoryNote('war-funding', pn.owner)
      if (letnevPlayer) {
        letnevPlayer.addPromissoryNote('war-funding', pn.owner)
      }

      this.log.add({
        template: 'War Funding: {player} rerolls dice. Card returned to {owner}.',
        args: { player: holderName, owner: pn.owner },
      })
    }
  }

  Twilight.prototype._offerCrownOfThalnos = function(ownerName, rollResult, context) {
    const player = this.players.byName(ownerName)
    if (!player || !this._hasRelic(player, 'the-crown-of-thalnos')) {
      return 0
    }

    // Find units with missed dice
    const unitsWithMisses = rollResult.rolls.filter(r =>
      r.ship.owner === ownerName && r.diceResults.some(d => !d.hit)
    )
    if (unitsWithMisses.length === 0) {
      return 0
    }

    const totalMisses = unitsWithMisses.reduce(
      (sum, r) => sum + r.diceResults.filter(d => !d.hit).length, 0
    )

    const choice = this.actions.choose(player, [
      `Reroll ${totalMisses} missed dice (+1 each)`,
      'Pass',
    ], {
      title: 'Crown of Thalnos: Reroll dice? Units that miss are destroyed.',
      noAutoRespond: true,
    })

    if (choice[0] === 'Pass') {
      return 0
    }

    let additionalHits = 0
    const unitsToDestroy = []

    for (const unitRoll of unitsWithMisses) {
      const missedDice = unitRoll.diceResults.filter(d => !d.hit)
      let unitGotHit = false

      for (const _die of missedDice) {
        const reroll = Math.floor(this.random() * 10) + 1
        // +1 bonus applied to result
        if (reroll + 1 >= unitRoll.effectiveCombat) {
          additionalHits++
          unitGotHit = true
        }
      }

      if (!unitGotHit) {
        unitsToDestroy.push(unitRoll.ship)
      }
    }

    // Destroy units that rerolled but didn't produce any hits
    const location = context.combatType === 'space' ? 'space' : context.planetId
    for (const ship of unitsToDestroy) {
      const removed = this._removeUnit(context.systemId, location, ship.id)
      if (removed) {
        this.factionAbilities.onUnitDestroyed(context.systemId, removed, ownerName,
          context.combatType === 'space' ? null : context.planetId)
      }
    }

    this.log.add({
      template: '{player} uses Crown of Thalnos: {hits} additional hits, {destroyed} units destroyed',
      args: { player, hits: additionalHits, destroyed: unitsToDestroy.length },
    })

    return additionalHits
  }

  Twilight.prototype._assignHits = function(systemId, ownerName, hits, destroyerName) {
    if (hits <= 0) {
      return
    }

    // Allow faction abilities to cancel hits (e.g., Titans agent Tellurian)
    const effectiveHits = this.factionAbilities.onHitsProduced(ownerName, systemId, hits, 'space')
    if (effectiveHits <= 0) {
      return
    }

    const systemUnits = this.state.units[systemId]
    let remainingHits = effectiveHits
    const assignments = []

    // Track which units just sustained this round (for Duranium Armor)
    const justSustainedIds = new Set()

    // Non-Euclidean Shielding: each sustain cancels 2 hits instead of 1
    const owner = this.players.byName(ownerName)
    const hitsPerSustain = owner
      ? this.factionAbilities.getSustainDamageHitsCancel(owner)
      : 1

    // First, sustain damage on undamaged ships that have the ability
    const sustainableShips = systemUnits.space
      .filter(u => u.owner === ownerName && !u.damaged)
      .filter(u => {
      // The Cavalry: override abilities for the chosen ship
        if (this.state._cavalryActive?.unitId === u.id) {
          return this.state._cavalryActive.abilities.includes('sustain-damage')
        }
        const def = this._getUnitStats(u.owner, u.type)
        return def && def.abilities.includes('sustain-damage')
      })
    // Prioritize most expensive ships for sustain
      .sort((a, b) => {
        const defA = this._getUnitStats(a.owner, a.type)
        const defB = this._getUnitStats(b.owner, b.type)
        return (defB?.cost || 0) - (defA?.cost || 0)
      })

    for (const ship of sustainableShips) {
      if (remainingHits <= 0) {
        break
      }
      ship.damaged = true
      justSustainedIds.add(ship.id)
      assignments.push({ owner: ownerName, unitType: ship.type, unitId: ship.id, result: 'sustained' })
      remainingHits = Math.max(0, remainingHits - hitsPerSustain)
    }

    // Faction hook: after units sustain damage (e.g., Letnev commander)
    if (justSustainedIds.size > 0) {
      this.factionAbilities.onUnitsSustainedDamage(ownerName, systemId, justSustainedIds.size)
    }

    // Then destroy cheapest ships first
    while (remainingHits > 0) {
      const ships = systemUnits.space.filter(u => u.owner === ownerName)
      if (ships.length === 0) {
        break
      }

      // Sort by cost ascending (destroy cheapest first)
      ships.sort((a, b) => {
        const defA = this._getUnitStats(a.owner, a.type)
        const defB = this._getUnitStats(b.owner, b.type)
        return (defA?.cost || 0) - (defB?.cost || 0)
      })

      const target = ships[0]
      const idx = systemUnits.space.findIndex(u => u.id === target.id)
      if (idx !== -1) {
        const removed = systemUnits.space.splice(idx, 1)[0]
        // Track destruction of war suns/flagships for secret objectives
        if (destroyerName && (removed.type === 'war-sun' || removed.type === 'flagship')) {
          this._recordSecretTrigger(destroyerName, 'destroy-their-greatest-ship')
        }
        if (destroyerName) {
          this.factionAbilities.onUnitDestroyed(systemId, removed, destroyerName, null)
        }

        // Track destroyed ship types for Salvage Operations
        if (!this.state._destroyedDuringCombat) {
          this.state._destroyedDuringCombat = {}
        }
        if (!this.state._destroyedDuringCombat[ownerName]) {
          this.state._destroyedDuringCombat[ownerName] = []
        }
        assignments.push({ owner: ownerName, unitType: removed.type, unitId: removed.id, result: 'destroyed' })
        this.state._destroyedDuringCombat[ownerName].push(removed.type)
      }
      remainingHits--
    }

    // Duranium Armor: repair 1 damaged unit that did NOT sustain this round
    if (owner && owner.hasTechnology('duranium-armor')) {
      const repairCandidate = systemUnits.space.find(
        u => u.owner === ownerName && u.damaged && !justSustainedIds.has(u.id)
      )
      if (repairCandidate) {
        repairCandidate.damaged = false
      }
    }

    if (assignments.length > 0) {
      this.state._combatLog.push({
        type: 'hits-assigned',
        combatType: 'space',
        systemId,
        assignments,
      })
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Invasion

  Twilight.prototype._invasionStep = function(player, systemId) {
    const systemUnits = this.state.units[systemId]
    if (!systemUnits) {
      return
    }

    const systemPlanets = this._getSystemPlanets(systemId)
    if (systemPlanets.length === 0) {
    // No planets — just discard any ground forces in space (can't exist without planet)
      this._discardGroundForcesInSpace(systemId, player.name)
      return
    }

    const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))

    // Find ground forces in space (in transit)
    const groundForcesInSpace = systemUnits.space
      .filter(u => u.owner === player.name && res.getUnit(u.type)?.category === 'ground')

    // Find enemy-controlled planets in this system (skip DMZ planets)
    const enemyPlanets = systemPlanets.filter(planetId => {
      if (this._isDemilitarizedZone?.(planetId)) {
        return false
      }
      const planetState = this.state.planets[planetId]
      return planetState && planetState.controller && planetState.controller !== player.name
    })

    // Coalescence: Titans mech on a planet forces ground combat
    const coalescencePlanets = systemPlanets.filter(planetId => {
      return this.factionAbilities.checkCoalescenceOnPlanet(systemId, planetId, player.name)
    })

    // Invasion if: enemy planets with ground forces to land, OR coalescence forces combat
    const shouldInvade = (enemyPlanets.length > 0 && groundForcesInSpace.length > 0)
    || coalescencePlanets.length > 0

    if (shouldInvade) {
      // Build list of planets to invade (enemy planets first, then coalescence-only)
      const planetsToInvade = [...enemyPlanets]
      for (const p of coalescencePlanets) {
        if (!planetsToInvade.includes(p)) {
          planetsToInvade.push(p)
        }
      }

      for (const targetPlanet of planetsToInvade) {
        // Check if there are still ground forces in space to commit
        const remainingForces = systemUnits.space
          .filter(u => u.owner === player.name && res.getUnit(u.type)?.category === 'ground')

        // Skip if no ground forces and not a coalescence planet
        if (remainingForces.length === 0 && !coalescencePlanets.includes(targetPlanet)) {
          continue
        }

        // Snapshot defender structures before combat (for L1Z1X Assimilate)
        const defenderName = this.state.planets[targetPlanet]?.controller
        const preInvasionStructures = {}
        if (defenderName) {
          const planetUnits = systemUnits.planets[targetPlanet] || []
          for (const unit of planetUnits) {
            if (unit.owner === defenderName) {
              const def = res.getUnit(unit.type)
              if (def?.category === 'structure') {
                preInvasionStructures[unit.type] = (preInvasionStructures[unit.type] || 0) + 1
              }
            }
          }
        }

        // Step 1: Bombardment
        this.state.currentInvasion = { systemId, planetId: targetPlanet, step: 'bombardment' }
        this._bombardment(systemId, targetPlanet, player.name)

        // Step 2: Space Cannon Defense (PDS fire at landing ground forces)
        this.state.currentInvasion.step = 'space-cannon-defense'
        this._spaceCannonDefense(systemId, targetPlanet, player.name)

        // Step 3: Commit ground forces from space to the planet
        this.state.currentInvasion.step = 'commit-forces'
        this._commitGroundForces(systemId, targetPlanet, player.name)

        // Step 4: Ground combat
        this.state.currentInvasion.step = 'ground-combat'
        this._groundCombat(systemId, targetPlanet, player.name)

        // Step 5: Establish control (pass pre-invasion structure counts)
        this.state.currentInvasion.step = 'establish-control'
        this._establishControl(systemId, targetPlanet, player.name, preInvasionStructures)
      }

      delete this.state.currentInvasion

      // After all invasions, auto-place any remaining ground forces on friendly/empty planets
      const remainingGround = systemUnits.space
        .filter(u => u.owner === player.name && res.getUnit(u.type)?.category === 'ground')
      if (remainingGround.length > 0) {
        this._autoPlaceGroundForces(systemId, player.name, tile, systemPlanets)
      }
    }
    else {
    // No enemy planets — auto-place ground forces on the first friendly/empty planet
      this._autoPlaceGroundForces(systemId, player.name, tile, systemPlanets)
    }
  }

  Twilight.prototype._bombardment = function(systemId, planetId, attackerName) {
    const systemUnits = this.state.units[systemId]
    const planetUnits = systemUnits.planets[planetId] || []

    // Check for planetary shield on defending units
    const defenderName = this.state.planets[planetId]?.controller
    if (!defenderName) {
      return
    }

    const hasShield = planetUnits.some(u => {
      if (u.owner !== defenderName) {
        return false
      }
      const def = this._getUnitStats(u.owner, u.type)
      return def && def.abilities.includes('planetary-shield')
    })

    // Ships with bombardment ability fire at the planet
    const attackerShips = systemUnits.space.filter(u => u.owner === attackerName)
    let totalHits = 0
    const bombardMissCombatValues = []
    let bombardmentUsed = false
    const attackerPlayer = this.players.byName(attackerName)
    let plasmaUsed = false

    // Commander bonus: +N dice to the first unit that fires (e.g., Argent Commander)
    let commanderBonusDice = this.factionAbilities.getUnitAbilityBonusDice(attackerName)
    const allBombardRolls = []
    const bombardCombatValues = new Set()
    let hadPlasmaScoring = false
    let hadCommanderBonusBombard = false

    for (const ship of attackerShips) {
      const unitDef = this._getUnitStats(ship.owner, ship.type)
      if (!unitDef) {
        continue
      }

      // Parse bombardment ability: 'bombardment-NxD' where N is combat value, D is dice count
      const bombAbility = unitDef.abilities.find(a => a.startsWith('bombardment-'))
      if (!bombAbility) {
        continue
      }

      const parts = bombAbility.replace('bombardment-', '').split('x')
      const combatValue = parseInt(parts[0])
      let diceCount = parseInt(parts[1])

      // War suns ignore planetary shield; other bombardment is blocked by it
      const isWarSun = unitDef.type === 'war-sun'
      if (hasShield && !isWarSun) {
        continue
      }

      // Plasma Scoring: +1 die for the first unit that fires bombardment
      if (!plasmaUsed && attackerPlayer.hasTechnology('plasma-scoring')) {
        diceCount++
        plasmaUsed = true
        hadPlasmaScoring = true
      }

      // Commander bonus dice to the first unit that fires
      if (commanderBonusDice > 0) {
        diceCount += commanderBonusDice
        commanderBonusDice = 0
        hadCommanderBonusBombard = true
      }

      bombardmentUsed = true
      bombardCombatValues.add(combatValue)
      for (let i = 0; i < diceCount; i++) {
        const roll = Math.floor(this.random() * 10) + 1
        allBombardRolls.push(roll)
        if (roll >= combatValue) {
          totalHits++
        }
        else {
          bombardMissCombatValues.push(combatValue)
        }
      }
    }

    // Jol-Nar Commander: reroll misses
    totalHits += this._offerUnitAbilityReroll(attackerName, bombardMissCombatValues)

    // X-89 Bacterial Weapon ΩΩ: double bombardment hits
    const preDoubleHits = totalHits
    if (attackerPlayer.hasTechnology('x89-bacterial-weapon')) {
      totalHits *= 2
    }

    if (totalHits > 0) {
      this.state._combatLog.push({
        type: 'bombardment',
        systemId,
        planetId,
        attacker: attackerName,
        hits: totalHits,
      })

      this.log.add({
        template: '{attacker} bombardment scores {hits} hits on {planet}',
        args: { attacker: attackerName, hits: totalHits, planet: planetId },
      })
      this.log.indent()
      const bombThresholds = [...bombardCombatValues].sort((a, b) => a - b).map(t => `${t}+`).join('/')
      let bombDetail = `Rolls: ${allBombardRolls.join(', ')} (need ${bombThresholds})`
      if (hadPlasmaScoring) {
        bombDetail += ', Plasma Scoring: +1 die'
      }
      if (hadCommanderBonusBombard) {
        bombDetail += ', Commander: +1 die'
      }
      this.log.add({ template: bombDetail, args: {} })
      if (totalHits !== preDoubleHits) {
        this.log.add({
          template: `X-89 Bacterial Weapon: hits doubled (${preDoubleHits} → ${totalHits})`,
          args: {},
        })
      }
      this.log.outdent()

      // Auto-assign bombardment hits to defender's ground forces (cheapest first)
      this._assignGroundHits(systemId, planetId, defenderName, totalHits, null, 'bombardment')

      // X-89 Bacterial Weapon ΩΩ: exhaust bombarded planet
      if (attackerPlayer.hasTechnology('x89-bacterial-weapon')) {
        if (this.state.planets[planetId]) {
          this.state.planets[planetId].exhausted = true
        }
        this.log.add({
          template: 'X-89 Bacterial Weapon: {planet} is exhausted',
          args: { planet: planetId },
        })
      }

      // make-an-example-of-their-world: destroyed all ground forces via bombardment
      const remainingGroundForces = (systemUnits.planets[planetId] || []).filter(u => {
        if (u.owner !== defenderName) {
          return false
        }
        const def = res.getUnit(u.type)
        return def && def.category === 'ground'
      })
      if (remainingGroundForces.length === 0) {
        this._recordSecretTrigger(attackerName, 'make-an-example-of-their-world')
      }
    }

    // Mech DEPLOY triggers (e.g., L1Z1X Annihilator) — only if bombardment was used
    if (bombardmentUsed) {
      this.factionAbilities.afterBombardment(attackerName, systemId, planetId, totalHits)
    }
  }

  // After space combat, if transports were destroyed, cargo (fighters/ground forces
  // in space) may exceed remaining capacity. Auto-remove excess cheapest first. (Rule 78.10a)
  Twilight.prototype._enforcePostCombatCapacity = function(systemId) {
    const systemUnits = this.state.units[systemId]
    if (!systemUnits) {
      return
    }

    // Check each player with units in the system
    const owners = new Set(systemUnits.space.map(u => u.owner))
    for (const ownerName of owners) {
      const player = this.players.byName(ownerName)
      if (!player) {
        continue
      }

      // Count total capacity from this player's non-capacity-requiring ships
      let totalCapacity = 0
      const capacityUnits = []
      for (const unit of systemUnits.space) {
        if (unit.owner !== ownerName) {
          continue
        }
        const unitDef = this._getUnitStats(ownerName, unit.type)
        if (!unitDef) {
          continue
        }
        if (unitDef.requiresCapacity && !this.factionAbilities.isCapacityExempt(player, unit.type)) {
          capacityUnits.push(unit)
        }
        else if (!unitDef.requiresCapacity) {
          totalCapacity += unitDef.capacity || 0
        }
      }

      const excess = capacityUnits.length - totalCapacity
      if (excess <= 0) {
        continue
      }

      // Player must choose which units to remove (Rule 78)
      for (let i = 0; i < excess; i++) {
        // Recalculate remaining capacity units
        const remaining = systemUnits.space.filter(u => {
          if (u.owner !== ownerName) {
            return false
          }
          const def = this._getUnitStats(ownerName, u.type)
          return def?.requiresCapacity && !this.factionAbilities.isCapacityExempt(player, u.type)
        })
        const remainingTypes = [...new Set(remaining.map(u => u.type))]

        let typeToRemove
        if (remainingTypes.length <= 1) {
          typeToRemove = remainingTypes[0]
        }
        else {
          const selection = this.actions.choose(player, remainingTypes, {
            title: 'Choose unit type to remove (excess capacity)',
          })
          typeToRemove = selection[0]
        }

        const idx = systemUnits.space.findIndex(
          u => u.owner === ownerName && u.type === typeToRemove
        )
        if (idx !== -1) {
          systemUnits.space.splice(idx, 1)
        }
      }

      this.log.add({
        template: '{player} removes {count} excess units due to insufficient capacity',
        args: { player: ownerName, count: excess },
      })
    }
  }

} // module.exports
