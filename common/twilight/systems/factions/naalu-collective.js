module.exports = {
  // Agent — Z'eu: After any player's command token is placed in a system,
  // exhaust to return that token to that player's reinforcements.
  onCommandTokenPlaced(player, ctx, { systemId, placerName }) {
    if (!player.isAgentReady()) {
      return
    }

    // The token must actually be in the system
    const tokens = ctx.state.systems[systemId]?.commandTokens || []
    if (!tokens.includes(placerName)) {
      return
    }

    const choice = ctx.actions.choose(player, ["Exhaust Z'eu", 'Pass'], {
      title: `Z'eu: Exhaust to return ${placerName}'s command token from system ${systemId}?`,
    })

    if (choice[0] !== "Exhaust Z'eu") {
      return
    }

    player.exhaustAgent()

    // Remove the token from the system
    const idx = tokens.indexOf(placerName)
    if (idx !== -1) {
      tokens.splice(idx, 1)
    }

    // Return to the placer's reinforcements (tactic pool)
    const placer = ctx.game.players.byName(placerName)
    if (placer) {
      placer.commandTokens.tactics++
    }

    ctx.log.add({
      template: "{player} exhausts Z'eu: returns {target}'s command token from {system}",
      args: { player: player.name, target: placerName, system: systemId },
    })
  },

  // Neuroglaive (faction tech): After another player activates a system with
  // your ships, that player removes 1 token from their fleet pool.
  onAnySystemActivated(naaluPlayer, ctx, { systemId, activatingPlayer }) {
    if (!naaluPlayer.hasTechnology('neuroglaive')) {
      return
    }

    // Only triggers when another player activates the system
    if (activatingPlayer.name === naaluPlayer.name) {
      return
    }

    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return
    }

    // Check if Naalu has ships in the system
    const naaluShips = systemUnits.space.filter(u => u.owner === naaluPlayer.name)
    if (naaluShips.length === 0) {
      return
    }

    // Re-fetch activating player to get current state
    const target = ctx.players.byName(activatingPlayer.name)
    if (!target || target.commandTokens.fleet <= 0) {
      return
    }

    target.commandTokens.fleet -= 1

    ctx.log.add({
      template: 'Neuroglaive: {target} loses 1 fleet pool token (activated system with {player} ships)',
      args: { player: naaluPlayer.name, target: target.name },
    })
  },

  // Foresight: After another player moves ships into a system with your ships,
  // place 1 strategy token in an adjacent system without other players' ships
  // and move your ships there.
  onShipsEnterSystem(player, ctx, { systemId, moverName }) {
    if (player.name === moverName) {
      return
    }
    if (player.commandTokens.strategy <= 0) {
      return
    }

    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return
    }

    const ownShips = systemUnits.space.filter(u => u.owner === player.name)
    if (ownShips.length === 0) {
      return
    }

    const adjacentSystems = ctx.game._getAdjacentSystems(systemId)
      .filter(adjId => {
        // Cannot place a token in a system where you already have one
        const tokens = ctx.state.systems[adjId]?.commandTokens || []
        if (tokens.includes(player.name)) {
          return false
        }
        // Cannot move into a system that contains another player's ships
        const adjUnits = ctx.state.units[adjId]
        if (adjUnits) {
          const otherShips = adjUnits.space.filter(
            u => u.owner !== player.name
          )
          if (otherShips.length > 0) {
            return false
          }
        }
        return true
      })

    if (adjacentSystems.length === 0) {
      return
    }

    const choices = ['Pass', ...adjacentSystems]
    const selection = ctx.actions.choose(player, choices, {
      title: 'Foresight: Place token and move 1 ship to adjacent system?',
    })

    if (selection[0] === 'Pass') {
      return
    }

    const targetSystem = selection[0]

    player.commandTokens.strategy -= 1

    if (!ctx.state.systems[targetSystem]) {
      ctx.state.systems[targetSystem] = { commandTokens: [] }
    }
    ctx.state.systems[targetSystem].commandTokens.push(player.name)

    // Move all own ships from the active system to the target system
    if (!ctx.state.units[targetSystem]) {
      ctx.state.units[targetSystem] = { space: [], planets: {} }
    }

    const shipsToMove = []
    for (let i = systemUnits.space.length - 1; i >= 0; i--) {
      if (systemUnits.space[i].owner === player.name) {
        const [ship] = systemUnits.space.splice(i, 1)
        shipsToMove.push(ship)
      }
    }
    for (const ship of shipsToMove) {
      ctx.state.units[targetSystem].space.push(ship)
    }

    const movedTypes = [...new Set(shipsToMove.map(s => s.type))].join(', ')
    ctx.log.add({
      template: '{player} uses Foresight: moves {ships} to {system}',
      args: { player, ships: movedTypes, system: targetSystem },
    })
  },

  // Commander — M'aban: May look at 1 neighbor's hand of promissory notes.
  // May also look at top or bottom card of the agenda deck.
  // This is an information ability — we expose it as a component action.
  componentActions: [
    {
      id: 'maban-peek',
      name: "M'aban: Peek at Promissory Notes / Agenda",
      abilityId: 'telepathic',  // All Naalu have this
      isAvailable(player) {
        return player.isCommanderUnlocked()
      },
    },
    {
      id: 'c-radium-geometry',
      name: 'C-RADIUM GEOMETRY (The Oracle)',
      abilityId: 'telepathic',  // All Naalu have this
      isAvailable(player) {
        return player.isHeroUnlocked() && !player.isHeroPurged()
      },
    },
  ],

  // M'aban: peek at neighbor's promissory notes and agenda deck
  mabanPeek(ctx, player) {
    // Get neighbors
    const neighbors = ctx.players.all().filter(p => p.name !== player.name)
    if (neighbors.length === 0) {
      return
    }

    // Choose a neighbor to peek at
    const neighborNames = neighbors.map(p => p.name)
    const neighborSel = ctx.actions.choose(player, neighborNames, {
      title: "M'aban: Choose a neighbor to view promissory notes",
    })
    const targetName = neighborSel[0]
    const target = ctx.players.byName(targetName)

    if (target) {
      const notes = target.getPromissoryNotes()
      const noteDesc = notes.length > 0
        ? notes.map(n => `${n.id} (from ${n.owner})`).join(', ')
        : '(none)'

      ctx.log.add({
        template: "M'aban: {player} views {target}'s promissory notes: {notes}",
        args: { player: player.name, target: targetName, notes: noteDesc },
        visibility: [player.name],
        redacted: "M'aban: {player} views {target}'s promissory notes",
      })
    }

    // Peek at agenda deck (top or bottom)
    const agendaDeck = ctx.state.agendaDeck || []
    if (agendaDeck.length > 0) {
      const peekChoice = ctx.actions.choose(player, ['Top', 'Bottom', 'Pass'], {
        title: "M'aban: Peek at top or bottom of agenda deck?",
      })

      if (peekChoice[0] === 'Top') {
        const topCard = agendaDeck[0]
        ctx.log.add({
          template: "M'aban: {player} peeks at top of agenda deck: {card}",
          args: { player: player.name, card: topCard?.name || topCard?.id || 'unknown' },
          visibility: [player.name],
          redacted: "M'aban: {player} peeks at top of agenda deck",
        })
      }
      else if (peekChoice[0] === 'Bottom') {
        const bottomCard = agendaDeck[agendaDeck.length - 1]
        ctx.log.add({
          template: "M'aban: {player} peeks at bottom of agenda deck: {card}",
          args: { player: player.name, card: bottomCard?.name || bottomCard?.id || 'unknown' },
          visibility: [player.name],
          redacted: "M'aban: {player} peeks at bottom of agenda deck",
        })
      }
    }
  },

  // Hero — The Oracle: C-RADIUM GEOMETRY
  // At the end of the status phase, each other player must give you 1 promissory
  // note from their hand. If they have none, they give 1 TG instead. Then purge.
  cRadiumGeometry(ctx, player) {
    for (const otherPlayer of ctx.players.all()) {
      if (otherPlayer.name === player.name) {
        continue
      }

      const notes = otherPlayer.getPromissoryNotes()
      if (notes.length > 0) {
        // Other player must choose 1 promissory note to give
        let noteToGive
        if (notes.length === 1) {
          noteToGive = notes[0]
        }
        else {
          const noteChoices = notes.map(n => `${n.id}:${n.owner}`)
          const noteSel = ctx.actions.choose(otherPlayer, noteChoices, {
            title: `The Oracle: Give ${player.name} 1 promissory note`,
          })
          const [noteId, noteOwner] = noteSel[0].split(':')
          noteToGive = otherPlayer.removePromissoryNote(noteId, noteOwner)
        }

        if (noteToGive) {
          if (notes.length === 1) {
            otherPlayer.removePromissoryNote(noteToGive.id, noteToGive.owner)
          }
          player.addPromissoryNote(noteToGive.id, noteToGive.owner)

          ctx.log.add({
            template: 'The Oracle: {other} gives {note} to {player}',
            args: { other: otherPlayer.name, note: noteToGive.id, player: player.name },
          })
        }
      }
      else {
        // No promissory notes — give 1 trade good
        if (otherPlayer.tradeGoods >= 1) {
          otherPlayer.spendTradeGoods(1)
          player.addTradeGoods(1)

          ctx.log.add({
            template: 'The Oracle: {other} gives 1 trade good to {player} (no promissory notes)',
            args: { other: otherPlayer.name, player: player.name },
          })
        }
        else {
          ctx.log.add({
            template: 'The Oracle: {other} has nothing to give',
            args: { other: otherPlayer.name },
          })
        }
      }
    }

    player.purgeHero()
    ctx.log.add({
      template: '{player} purges The Oracle',
      args: { player: player.name },
    })
  },

  // Mech — Iconoclast: DEPLOY — When another player gains a relic,
  // place 1 mech on any planet you control.
  onRelicGained(player, ctx, { gainingPlayer }) {
    if (gainingPlayer.name === player.name) {
      return
    }

    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length === 0) {
      return
    }

    const choices = ['Pass', ...controlledPlanets]
    const sel = ctx.actions.choose(player, choices, {
      title: `Iconoclast: ${gainingPlayer.name} gained a relic. Place 1 mech?`,
    })

    if (sel[0] === 'Pass') {
      return
    }

    const targetPlanet = sel[0]
    const systemId = ctx.game._findSystemForPlanet(targetPlanet)
    if (systemId) {
      ctx.game._addUnit(systemId, targetPlanet, 'mech', player.name)

      ctx.log.add({
        template: 'Iconoclast: {player} deploys mech on {planet} (relic gained by {other})',
        args: { player: player.name, planet: targetPlanet, other: gainingPlayer.name },
      })
    }
  },

  // Mindsieve: when resolving another player's strategy card secondary,
  // may give them a promissory note instead of spending a command token.
  canSkipSecondaryCostWithPromissoryNote(player, _ctx) {
    return player.hasTechnology('mindsieve')
  },
}
