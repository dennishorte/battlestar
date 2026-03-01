module.exports = function(Twilight) {

  ////////////////////////////////////////////////////////////////////////////////
  // Neighbor detection (for trade)

  Twilight.prototype.areNeighbors = function(playerA, playerB) {
  // Two players are neighbors if either:
  // 1. They both have units (ships or ground forces) in the same system
  // 2. They have units in adjacent systems
  // 3. A faction ability overrides neighbor status (e.g., I.I.H.Q. Modernization)
    const systemsA = this._getSystemsWithUnits(playerA)
    const systemsB = this._getSystemsWithUnits(playerB)

    // Check same system
    for (const sysId of systemsA) {
      if (systemsB.includes(sysId)) {
        return true
      }
    }

    // Check adjacent systems
    for (const sysA of systemsA) {
      const adjacent = this._getAdjacentSystems(sysA)
      for (const sysB of systemsB) {
        if (adjacent.includes(sysB)) {
          return true
        }
      }
    }

    // Check faction ability neighbor overrides
    if (this.factionAbilities.isNeighborOverride(playerA, playerB)) {
      return true
    }

    return false
  }

  Twilight.prototype._getSystemsWithUnits = function(playerName) {
    const systems = []
    for (const [systemId, systemUnits] of Object.entries(this.state.units)) {
      const hasSpaceUnits = systemUnits.space.some(u => u.owner === playerName)
      const hasPlanetUnits = Object.values(systemUnits.planets).some(
        units => units.some(u => u.owner === playerName)
      )
      if (hasSpaceUnits || hasPlanetUnits) {
        systems.push(systemId)
      }
    }
    return systems
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Transactions

  Twilight.prototype._offerTransactions = function(player) {
  // Find neighbors the player hasn't traded with this turn
    while (true) {
      const neighbors = this._getAvailableTradePartners(player)
      if (neighbors.length === 0) {
        break
      }

      // Check if player or any neighbor has trade goods or commodities
      const hasResources = player.tradeGoods > 0 || player.commodities > 0
      const neighborHasResources = neighbors.some(n => {
        const p = this.players.byName(n)
        return p.tradeGoods > 0 || p.commodities > 0
      })
      if (!hasResources && !neighborHasResources) {
        break
      }

      const choices = ['Skip Transaction', ...neighbors]
      const selection = this.actions.choose(player, choices, {
        title: 'Propose Transaction?',
      })

      const targetName = selection[0]
      if (targetName === 'Skip Transaction') {
        break
      }

      this._resolveTransaction(player, targetName)
    }
  }

  Twilight.prototype._getAvailableTradePartners = function(player) {
    const traded = this.state.transactionsThisTurn || {}
    // Hacan Guild Ships: can trade with non-neighbors
    const hasGuildShips = this.factionAbilities.canTradeWithNonNeighbors(player)
    return this.players.all()
      .filter(p => p.name !== player.name)
      .filter(p => hasGuildShips || this.areNeighbors(player.name, p.name))
      .filter(p => !traded[p.name])
      .map(p => p.name)
  }

  Twilight.prototype._resolveTransaction = function(player, targetName) {
    const target = this.players.byName(targetName)

    // Mark this neighbor as traded with (one attempt per neighbor per turn)
    if (!this.state.transactionsThisTurn) {
      this.state.transactionsThisTurn = {}
    }
    this.state.transactionsThisTurn[targetName] = true

    // Active player proposes: what they offer
    const offerSelection = this.actions.choose(player, ['Done'], {
      title: `Offer to ${targetName}`,
      allowsAction: 'trade-offer',
    })

    if (offerSelection.action !== 'trade-offer') {
      return
    }

    const offering = offerSelection.offering || {}
    const requesting = offerSelection.requesting || {}

    // Validate the active player can afford what they're offering
    if ((offering.tradeGoods || 0) > player.tradeGoods) {
      return
    }
    if ((offering.commodities || 0) > player.commodities) {
      return
    }

    // Validate action card trading (requires Hacan Arbiters)
    const hasActionCards = (offering.actionCards || []).length > 0 || (requesting.actionCards || []).length > 0
    if (hasActionCards && !this.factionAbilities.canTradeActionCards(player, target)) {
      return
    }

    // Rule 69.2: max 1 promissory note per side per transaction
    if ((offering.promissoryNotes || []).length > 1) {
      return
    }
    if ((requesting.promissoryNotes || []).length > 1) {
      return
    }

    // Validate planet trading (Hacan mech — Pride of Kenara)
    const offeredPlanet = offering.planet
    const requestedPlanet = requesting.planet
    if (offeredPlanet) {
      const handler = this.factionAbilities._getPlayerHandler(player)
      if (!handler?.canTradePlanet || !handler.canTradePlanet(player, this.factionAbilities, offeredPlanet)) {
        return
      }
      if (this.state.planets[offeredPlanet]?.controller !== player.name) {
        return
      }
    }
    if (requestedPlanet) {
      const handler = this.factionAbilities._getPlayerHandler(target)
      if (!handler?.canTradePlanet || !handler.canTradePlanet(target, this.factionAbilities, requestedPlanet)) {
        return
      }
      if (this.state.planets[requestedPlanet]?.controller !== target.name) {
        return
      }
    }

    // Validate captured unit returns (Rule 17.2a — only non-fighter/infantry, Rule 17.4a)
    const offeredCaptures = offering.capturedUnits || []
    for (const cap of offeredCaptures) {
      const playerCaptured = this.state.capturedUnits[player.name] || []
      const exists = playerCaptured.some(
        c => c.type === cap.type && c.originalOwner === targetName
      )
      if (!exists) {
        return
      }
      if (cap.type === 'fighter' || cap.type === 'infantry') {
        return
      }
    }

    const requestedCaptures = requesting.capturedUnits || []
    for (const cap of requestedCaptures) {
      const targetCaptured = this.state.capturedUnits[targetName] || []
      const exists = targetCaptured.some(
        c => c.type === cap.type && c.originalOwner === player.name
      )
      if (!exists) {
        return
      }
      if (cap.type === 'fighter' || cap.type === 'infantry') {
        return
      }
    }

    // Mahact Hubris: cannot receive Alliance promissory notes
    const offeredAllianceToMahact = (offering.promissoryNotes || [])
      .some(n => n.id === 'alliance') && this.factionAbilities._hasAbility(target, 'hubris')
    const requestedAllianceFromMahact = (requesting.promissoryNotes || [])
      .some(n => n.id === 'alliance') && this.factionAbilities._hasAbility(player, 'hubris')
    if (offeredAllianceToMahact || requestedAllianceFromMahact) {
      return
    }

    // Target player accepts or rejects
    const response = this.actions.choose(target, ['Accept', 'Reject'], {
      title: `Transaction from ${player.name}`,
      context: {
        offering,
        requesting,
      },
    })

    if (response[0] !== 'Accept') {
      this.log.add({
        template: '{target} rejects transaction from {player}',
        args: { target: targetName, player },
      })
      return
    }

    // Validate the target can afford what's requested
    if ((requesting.tradeGoods || 0) > target.tradeGoods) {
      return
    }
    if ((requesting.commodities || 0) > target.commodities) {
      return
    }

    // Execute the exchange
    this._executeTransaction(player, target, offering, requesting)
  }

  Twilight.prototype._executeTransaction = function(player, target, offering, requesting) {
  // Player gives offering to target
    const offeredTG = offering.tradeGoods || 0
    const offeredComm = offering.commodities || 0

    if (offeredTG > 0) {
      player.spendTradeGoods(offeredTG)
      target.addTradeGoods(offeredTG)  // trade goods stay as trade goods
    }
    if (offeredComm > 0) {
      player.commodities -= offeredComm
      target.addTradeGoods(offeredComm)  // commodities convert to trade goods on receipt
    }

    // Target gives requesting to player
    const requestedTG = requesting.tradeGoods || 0
    const requestedComm = requesting.commodities || 0

    if (requestedTG > 0) {
      target.spendTradeGoods(requestedTG)
      player.addTradeGoods(requestedTG)
    }
    if (requestedComm > 0) {
      target.commodities -= requestedComm
      player.addTradeGoods(requestedComm)  // commodities convert to trade goods on receipt
    }

    // Exchange promissory notes
    const offeredNotes = offering.promissoryNotes || []
    for (const noteSpec of offeredNotes) {
      const note = player.removePromissoryNote(noteSpec.id, noteSpec.owner)
      if (note) {
        target.addPromissoryNote(note.id, note.owner)
      }
    }

    const requestedNotes = requesting.promissoryNotes || []
    for (const noteSpec of requestedNotes) {
      const note = target.removePromissoryNote(noteSpec.id, noteSpec.owner)
      if (note) {
        player.addPromissoryNote(note.id, note.owner)
      }
    }

    // Exchange action cards (Hacan Arbiters)
    const offeredCards = offering.actionCards || []
    for (const cardId of offeredCards) {
      const idx = (player.actionCards || []).findIndex(c => c.id === cardId)
      if (idx !== -1) {
        const [card] = player.actionCards.splice(idx, 1)
        if (!target.actionCards) {
          target.actionCards = []
        }
        target.actionCards.push(card)
      }
    }

    const requestedCards = requesting.actionCards || []
    for (const cardId of requestedCards) {
      const idx = (target.actionCards || []).findIndex(c => c.id === cardId)
      if (idx !== -1) {
        const [card] = target.actionCards.splice(idx, 1)
        if (!player.actionCards) {
          player.actionCards = []
        }
        player.actionCards.push(card)
      }
    }

    // Planet trades (Hacan mech — Pride of Kenara)
    if (offering.planet) {
      this._transferPlanetInTransaction(player, target, offering.planet)
    }
    if (requesting.planet) {
      this._transferPlanetInTransaction(target, player, requesting.planet)
    }

    // Return captured units (Rule 17.2a)
    const offeredCaptures = offering.capturedUnits || []
    for (const cap of offeredCaptures) {
      const captured = this.state.capturedUnits[player.name] || []
      const idx = captured.findIndex(
        c => c.type === cap.type && c.originalOwner === target.name
      )
      if (idx !== -1) {
        captured.splice(idx, 1)
      }
    }

    const requestedCaptures = requesting.capturedUnits || []
    for (const cap of requestedCaptures) {
      const captured = this.state.capturedUnits[target.name] || []
      const idx = captured.findIndex(
        c => c.type === cap.type && c.originalOwner === player.name
      )
      if (idx !== -1) {
        captured.splice(idx, 1)
      }
    }

    this.log.add({
      template: '{player} and {target} complete a transaction',
      args: { player, target },
    })

    // Dark Pact: check commodity gifts between holder and Empyrean
    if (offeredComm > 0) {
      this.factionAbilities.onCommodityExchanged(player.name, target.name, offeredComm)
    }
    if (requestedComm > 0) {
      this.factionAbilities.onCommodityExchanged(target.name, player.name, requestedComm)
    }

    // Mentak Pillage: after transaction, Mentak neighbor can steal 1 TG/commodity
    this.factionAbilities.onTransactionComplete(player)
    this.factionAbilities.onTransactionComplete(target)
  }


  Twilight.prototype._transferPlanetInTransaction = function(giver, receiver, planetId) {
    const systemId = this._findSystemForPlanet(planetId)
    if (!systemId) {
      return
    }

    // Transfer planet control
    this.state.planets[planetId].controller = receiver.name

    // Move all giver's units from this planet to another planet they control
    const planetUnits = this.state.units[systemId]?.planets[planetId] || []
    const giverUnits = planetUnits.filter(u => u.owner === giver.name)

    if (giverUnits.length > 0) {
    // Find another planet the giver controls to relocate units
      const otherPlanets = giver.getControlledPlanets().filter(p => p !== planetId)

      if (otherPlanets.length > 0) {
        let destPlanet
        if (otherPlanets.length === 1) {
          destPlanet = otherPlanets[0]
        }
        else {
          const sel = this.actions.choose(giver, otherPlanets, {
            title: 'Pride of Kenara: Move units to which planet?',
          })
          destPlanet = sel[0]
        }

        const destSystem = this._findSystemForPlanet(destPlanet)
        if (destSystem) {
        // Move units
          for (const unit of giverUnits) {
            const idx = planetUnits.indexOf(unit)
            if (idx !== -1) {
              planetUnits.splice(idx, 1)
            }
            if (!this.state.units[destSystem].planets[destPlanet]) {
              this.state.units[destSystem].planets[destPlanet] = []
            }
            this.state.units[destSystem].planets[destPlanet].push(unit)
          }

          this.log.add({
            template: 'Pride of Kenara: {player} moves {count} unit(s) from {from} to {to}',
            args: { player: giver.name, count: giverUnits.length, from: planetId, to: destPlanet },
          })
        }
      }
    }

    this.log.add({
      template: '{giver} trades planet {planet} to {receiver}',
      args: { giver: giver.name, planet: planetId, receiver: receiver.name },
    })
  }

} // module.exports
