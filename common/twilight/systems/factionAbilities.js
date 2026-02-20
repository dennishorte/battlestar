const { GameProxy } = require('../../lib/game/GameProxy.js')


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


  // ---------------------------------------------------------------------------
  // C. Combat Triggers — event-driven, called from space combat flow
  // ---------------------------------------------------------------------------

  onSpaceCombatStart(systemId, attacker, defender) {
    this._mentakAmbush(systemId, attacker, defender)
  }

  onSpaceCombatRound(systemId, attacker, defender) {
    this._munitionsReserves(systemId, attacker, defender)
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
}


module.exports = { FactionAbilities }
