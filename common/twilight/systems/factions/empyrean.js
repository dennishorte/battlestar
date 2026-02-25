module.exports = {
  canMoveThroughNebulae() {
    return true
  },

  onPreMovement(player, ctx, { activatingPlayer }) {
    if (player.name === activatingPlayer.name) {
      return
    }

    const hasShips = Object.values(ctx.state.units).some(
      su => su.space.some(u => u.owner === player.name)
    )
    if (!hasShips) {
      return
    }

    const choice = ctx.actions.choose(player, ['Allow Passage', 'Deny'], {
      title: `Aetherpassage: Allow ${activatingPlayer.name} to move through your systems?`,
    })

    if (choice[0] === 'Allow Passage') {
      ctx.state.aetherpassageGrant = player.name

      ctx.log.add({
        template: '{empyrean} grants aetherpassage to {player}',
        args: { empyrean: player, player: activatingPlayer },
      })
    }
  },

  // Commander — Xuange: After another player moves ships into a system that
  // contains 1 of your command tokens, you may return that token to your
  // reinforcements.
  //
  // Voidwatch: After a player moves ships into a system with your units,
  // they must give you 1 promissory note (or 1 TG if none).
  onShipsEnterSystem(player, ctx, { systemId, moverName }) {
    // Commander: Xuange
    if (player.isCommanderUnlocked()) {
      const tokens = ctx.state.systems[systemId]?.commandTokens || []
      if (tokens.includes(player.name)) {
        const choice = ctx.actions.choose(player, ['Return Token', 'Pass'], {
          title: `Xuange: ${moverName} moved ships into a system with your token. Return it?`,
        })

        if (choice[0] === 'Return Token') {
          const idx = tokens.indexOf(player.name)
          if (idx !== -1) {
            tokens.splice(idx, 1)
          }

          player.commandTokens.tactics += 1

          ctx.log.add({
            template: 'Xuange: {player} returns command token from system {system}',
            args: { player: player.name, system: systemId },
          })
        }
      }
    }

    // Voidwatch
    if (player.hasTechnology('voidwatch')) {
      const systemUnits = ctx.state.units[systemId]
      if (systemUnits) {
        const hasOwnUnits = systemUnits.space.some(u => u.owner === player.name)
          || Object.values(systemUnits.planets).some(
            planetUnits => planetUnits.some(u => u.owner === player.name)
          )

        if (hasOwnUnits) {
          const mover = ctx.players.byName(moverName)
          if (mover) {
            const moverNotes = mover.getPromissoryNotes()
            if (moverNotes.length > 0) {
              let noteToGive
              if (moverNotes.length === 1) {
                noteToGive = moverNotes[0]
              }
              else {
                const noteChoices = moverNotes.map(n => `${n.id} (from ${n.owner})`)
                const selection = ctx.actions.choose(mover, noteChoices, {
                  title: `Voidwatch: Give ${player.name} 1 promissory note`,
                })
                const idx = noteChoices.indexOf(selection[0])
                noteToGive = moverNotes[idx]
              }

              mover.removePromissoryNote(noteToGive.id, noteToGive.owner)
              player.addPromissoryNote(noteToGive.id, noteToGive.owner)

              ctx.log.add({
                template: 'Voidwatch: {mover} gives {note} to {empyrean}',
                args: { mover: moverName, note: noteToGive.id, empyrean: player.name },
              })
            }
            else {
              // No promissory notes — give 1 trade good instead
              if (mover.tradeGoods > 0) {
                mover.addTradeGoods(-1)
                player.addTradeGoods(1)

                ctx.log.add({
                  template: 'Voidwatch: {mover} gives 1 trade good to {empyrean} (no promissory notes)',
                  args: { mover: moverName, empyrean: player.name },
                })
              }
            }
          }
        }
      }
    }
  },

  // ---------------------------------------------------------------------------
  // Hero — Conservator Procyon (MULTIVERSE SHIFT)
  // ---------------------------------------------------------------------------
  // ACTION: Place 1 frontier token in each system that does not contain any
  // planets and does not already have a frontier token. Then, explore each
  // frontier token that is in a system that contains 1 or more of your ships.
  // Then, purge this card.

  componentActions: [
    {
      id: 'multiverse-shift',
      name: 'Multiverse Shift',
      abilityId: 'voidborn',  // Any ability — real check is hero status
      isAvailable: (player) => player.isHeroUnlocked() && !player.isHeroPurged(),
    },
  ],

  multiverseShift(ctx, player) {
    const res = ctx.game.res

    // Place frontier tokens in all empty systems (no planets, no frontier token yet)
    const frontierSystems = []
    for (const [systemId, _system] of Object.entries(ctx.state.systems)) {
      const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
      if (!tile) {
        continue
      }
      // Skip systems with planets
      if (tile.planets && tile.planets.length > 0) {
        continue
      }
      // Skip home systems and mecatol
      if (tile.type === 'home' || tile.type === 'mecatol') {
        continue
      }
      // Skip systems that already have a frontier token (already explored)
      if (ctx.state.exploredPlanets && ctx.state.exploredPlanets[systemId]) {
        continue
      }
      frontierSystems.push(systemId)
    }

    // Place frontier tokens
    if (!ctx.state.exploredPlanets) {
      ctx.state.exploredPlanets = {}
    }

    let tokensPlaced = 0
    for (const sysId of frontierSystems) {
      // Mark as having a frontier token (but NOT explored yet)
      if (!ctx.state._frontierTokens) {
        ctx.state._frontierTokens = {}
      }
      ctx.state._frontierTokens[sysId] = true
      tokensPlaced++
    }

    ctx.log.add({
      template: 'Multiverse Shift: {player} places {count} frontier tokens',
      args: { player: player.name, count: tokensPlaced },
    })

    // Explore frontier tokens in systems with Empyrean ships
    let explored = 0
    const allFrontierSystems = [
      ...frontierSystems,
      // Also include already-existing frontier tokens that haven't been explored
    ]

    for (const sysId of allFrontierSystems) {
      const systemUnits = ctx.state.units[sysId]
      if (!systemUnits) {
        continue
      }

      const hasShips = systemUnits.space.some(u => u.owner === player.name)
      if (!hasShips) {
        continue
      }

      // Explore the frontier token
      ctx.state.exploredPlanets[sysId] = true
      if (ctx.state._frontierTokens) {
        delete ctx.state._frontierTokens[sysId]
      }

      const card = ctx.game._drawExplorationCard('frontier')
      if (card) {
        ctx.log.add({
          template: 'Multiverse Shift: {player} explores frontier in system {system} — {card}',
          args: { player: player.name, system: sysId, card: card.name },
        })

        // Apply simple frontier effects
        if (card.tradeGoods) {
          player.addTradeGoods(card.tradeGoods)
        }
        if (card.relicFragment) {
          if (!player.relicFragments) {
            player.relicFragments = []
          }
          player.relicFragments.push(card.relicFragment)
        }
      }
      explored++
    }

    ctx.log.add({
      template: 'Multiverse Shift: {player} explored {count} frontier tokens',
      args: { player: player.name, count: explored },
    })

    // Purge hero
    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Conservator Procyon',
      args: { player: player.name },
    })
  },


  // ---------------------------------------------------------------------------
  // Mech — Watcher
  // ---------------------------------------------------------------------------
  // You may remove this unit from a system that contains or is adjacent to
  // another player's units to cancel an action card played by that player.

  onActionCardPlayed(empyreanPlayer, ctx, { playingPlayer, card }) {
    // Find mechs the Empyrean player has that are in/adjacent to the playing player's units
    const eligibleMechs = []

    for (const [systemId, systemUnits] of Object.entries(ctx.state.units)) {
      // Check if Empyrean has mechs on planets in this system
      for (const [planetId, planetUnits] of Object.entries(systemUnits.planets)) {
        const mechs = planetUnits.filter(
          u => u.owner === empyreanPlayer.name && u.type === 'mech'
        )
        if (mechs.length === 0) {
          continue
        }

        // Check if the playing player has units in this system or adjacent systems
        const hasPlayerUnits = systemUnits.space.some(u => u.owner === playingPlayer.name)
          || Object.values(systemUnits.planets).some(
            pu => pu.some(u => u.owner === playingPlayer.name)
          )

        if (hasPlayerUnits) {
          eligibleMechs.push({ systemId, planetId, mech: mechs[0] })
          continue
        }

        // Check adjacent systems
        const adjacent = ctx.game._getAdjacentSystems(systemId)
        const hasAdjacentUnits = adjacent.some(adjId => {
          const adjUnits = ctx.state.units[adjId]
          if (!adjUnits) {
            return false
          }
          return adjUnits.space.some(u => u.owner === playingPlayer.name)
            || Object.values(adjUnits.planets).some(
              pu => pu.some(u => u.owner === playingPlayer.name)
            )
        })

        if (hasAdjacentUnits) {
          eligibleMechs.push({ systemId, planetId, mech: mechs[0] })
        }
      }

      // Also check mechs in space area (if somehow there)
      const spaceMechs = systemUnits.space.filter(
        u => u.owner === empyreanPlayer.name && u.type === 'mech'
      )
      if (spaceMechs.length > 0) {
        const hasPlayerUnits = systemUnits.space.some(u => u.owner === playingPlayer.name)
          || Object.values(systemUnits.planets).some(
            pu => pu.some(u => u.owner === playingPlayer.name)
          )
        if (hasPlayerUnits) {
          eligibleMechs.push({ systemId, planetId: null, mech: spaceMechs[0] })
        }
      }
    }

    if (eligibleMechs.length === 0) {
      return false
    }

    const choice = ctx.actions.choose(empyreanPlayer, ['Cancel Action Card', 'Pass'], {
      title: `Watcher: Remove mech to cancel ${playingPlayer.name}'s ${card.name}?`,
    })

    if (choice[0] !== 'Cancel Action Card') {
      return false
    }

    // Remove the mech
    const target = eligibleMechs[0]
    if (target.planetId) {
      const planetUnits = ctx.state.units[target.systemId].planets[target.planetId]
      const idx = planetUnits.indexOf(target.mech)
      if (idx !== -1) {
        planetUnits.splice(idx, 1)
      }
    }
    else {
      const spaceUnits = ctx.state.units[target.systemId].space
      const idx = spaceUnits.indexOf(target.mech)
      if (idx !== -1) {
        spaceUnits.splice(idx, 1)
      }
    }

    ctx.log.add({
      template: "Watcher: {player} removes mech from system {system} to cancel {target}'s {card}",
      args: {
        player: empyreanPlayer.name,
        system: target.systemId,
        target: playingPlayer.name,
        card: card.name,
      },
    })

    return true // Card is cancelled
  },


  // Agent — Acamar: After a player activates a system, exhaust to either
  // gain 1 trade good, or give the activating player 1 command token.
  onAnySystemActivated(empyreanPlayer, ctx, { systemId, activatingPlayer }) {
    // Agent: Acamar
    if (empyreanPlayer.isAgentReady()) {
      const choices = ['Exhaust Acamar', 'Pass']
      const choice = ctx.actions.choose(empyreanPlayer, choices, {
        title: `Acamar: ${activatingPlayer.name} activated a system. Exhaust agent?`,
      })

      if (choice[0] === 'Exhaust Acamar') {
        empyreanPlayer.exhaustAgent()

        const effectChoices = [
          'Gain 1 Trade Good',
          `Give ${activatingPlayer.name} 1 Command Token`,
        ]
        const effectChoice = ctx.actions.choose(empyreanPlayer, effectChoices, {
          title: 'Acamar: Choose effect',
        })

        if (effectChoice[0] === 'Gain 1 Trade Good') {
          empyreanPlayer.addTradeGoods(1)
          ctx.log.add({
            template: 'Acamar: {player} gains 1 trade good',
            args: { player: empyreanPlayer.name },
          })
        }
        else {
          activatingPlayer.commandTokens.tactics += 1
          ctx.log.add({
            template: 'Acamar: {player} gives {target} 1 command token',
            args: { player: empyreanPlayer.name, target: activatingPlayer.name },
          })
        }
      }
    }

    // Aetherstream: After you or a neighbor activates a system adjacent to an
    // anomaly, may apply +1 move to that player's ships during this tactical action.
    if (empyreanPlayer.hasTechnology('aetherstream')) {
      // Must be the Empyrean player or a neighbor
      const isSelf = empyreanPlayer.name === activatingPlayer.name
      const isNeighbor = !isSelf && ctx.game.areNeighbors(empyreanPlayer.name, activatingPlayer.name)

      if (isSelf || isNeighbor) {
        // Check if the activated system is adjacent to an anomaly
        const adjacentSystems = ctx.game._getAdjacentSystems(systemId)
        const adjacentToAnomaly = adjacentSystems.some(adjId => {
          const tile = ctx.game.res.getSystemTile(adjId) || ctx.game.res.getSystemTile(Number(adjId))
          return tile && tile.anomaly !== null
        })

        if (adjacentToAnomaly) {
          const choice = ctx.actions.choose(empyreanPlayer, ['Apply Aetherstream', 'Pass'], {
            title: `Aetherstream: Apply +1 move to ${activatingPlayer.name}'s ships?`,
          })

          if (choice[0] === 'Apply Aetherstream') {
            ctx.state.currentTacticalAction = ctx.state.currentTacticalAction || {}
            ctx.state.currentTacticalAction.aetherstreamBonus = activatingPlayer.name

            ctx.log.add({
              template: 'Aetherstream: {empyrean} grants +1 move to {player}',
              args: { empyrean: empyreanPlayer.name, player: activatingPlayer.name },
            })
          }
        }
      }
    }

    // Void Tether: when Empyrean activates a system containing or adjacent to
    // their units/planets, may place or move a void tether token on a border.
    if (empyreanPlayer.name === activatingPlayer.name && empyreanPlayer.hasTechnology('void-tether')) {
      this._offerVoidTether(empyreanPlayer, ctx, systemId)
    }
  },

  _offerVoidTether(player, ctx, systemId) {
    // Check: activated system must contain or be adjacent to a system with player's units/planets
    const hasPresenceInSystem = this._hasPresence(player, ctx, systemId)
    const adjacentSystems = ctx.game._getAdjacentSystems(systemId)
    const hasPresenceInAdjacent = adjacentSystems.some(adjId => this._hasPresence(player, ctx, adjId))

    if (!hasPresenceInSystem && !hasPresenceInAdjacent) {
      return
    }

    // Get borders the activated system shares with other systems
    const borderChoices = adjacentSystems.map(adjId => `Border ${systemId}-${adjId}`)
    if (borderChoices.length === 0) {
      return
    }

    const choices = [...borderChoices, 'Pass']
    const selection = ctx.actions.choose(player, choices, {
      title: 'Void Tether: Place or move a void tether token on which border?',
    })

    if (selection[0] === 'Pass') {
      return
    }

    // Parse the selected border
    const parts = selection[0].replace('Border ', '').split('-')
    const sysA = parts[0]
    const sysB = parts[1]

    // Initialize token array
    if (!ctx.state.voidTetherTokens) {
      ctx.state.voidTetherTokens = []
    }

    // Remove existing token if moving (Empyrean has max 2 tokens but we simplify to 1 for now)
    const existingIdx = ctx.state.voidTetherTokens.findIndex(t => t.owner === player.name)
    if (existingIdx !== -1) {
      ctx.state.voidTetherTokens.splice(existingIdx, 1)
    }

    ctx.state.voidTetherTokens.push({
      owner: player.name,
      systems: [sysA, sysB],
    })

    ctx.log.add({
      template: 'Void Tether: {player} places token on border between systems {sysA} and {sysB}',
      args: { player: player.name, sysA, sysB },
    })
  },

  _hasPresence(player, ctx, systemId) {
    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return false
    }
    // Check space units
    if (systemUnits.space.some(u => u.owner === player.name)) {
      return true
    }
    // Check planet units or planet control
    const tile = ctx.game.res.getSystemTile(systemId) || ctx.game.res.getSystemTile(Number(systemId))
    if (tile) {
      for (const planetId of tile.planets) {
        if (ctx.state.planets[planetId]?.controller === player.name) {
          return true
        }
        const planetUnits = systemUnits.planets[planetId] || []
        if (planetUnits.some(u => u.owner === player.name)) {
          return true
        }
      }
    }
    return false
  },

}
