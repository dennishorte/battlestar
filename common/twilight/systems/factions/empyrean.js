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
  },

}
