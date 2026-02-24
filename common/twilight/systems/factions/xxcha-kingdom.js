const res = require('../../res/index.js')

module.exports = {
  afterDiplomacyResolved(player, ctx) {
    const controlledPlanets = player.getControlledPlanets()
    const adjacentPlanets = new Set()

    for (const planetId of controlledPlanets) {
      const systemId = ctx.game._findSystemForPlanet(planetId)
      if (!systemId) {
        continue
      }

      const adjacentSystems = ctx.game._getAdjacentSystems(systemId)
      for (const adjSystemId of adjacentSystems) {
        const tile = res.getSystemTile(adjSystemId) || res.getSystemTile(Number(adjSystemId))
        if (!tile) {
          continue
        }
        for (const adjPlanetId of tile.planets) {
          if (ctx.state.planets[adjPlanetId]?.controller === player.name) {
            continue
          }
          const planetUnits = ctx.state.units[adjSystemId]?.planets[adjPlanetId] || []
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
    const selection = ctx.actions.choose(player, choices, {
      title: 'Peace Accords: Gain control of an unoccupied adjacent planet?',
    })

    if (selection[0] === 'Pass') {
      return
    }

    const targetPlanet = selection[0]
    const targetSystemId = ctx.game._findSystemForPlanet(targetPlanet)
    if (targetSystemId) {
      ctx.state.planets[targetPlanet].controller = player.name
      ctx.state.planets[targetPlanet].exhausted = true

      ctx.log.add({
        template: '{player} uses Peace Accords: gains control of {planet}',
        args: { player, planet: targetPlanet },
      })
    }
  },

  onAgendaRevealed(player, ctx, agenda) {
    if (player.commandTokens.strategy < 1) {
      return null
    }

    const choice = ctx.actions.choose(player, ['Quash', 'Pass'], {
      title: `Quash agenda "${agenda.name}"? (Spend 1 strategy token)`,
    })

    if (choice[0] === 'Quash') {
      player.commandTokens.strategy -= 1

      ctx.log.add({
        template: '{player} uses Quash: discards agenda',
        args: { player },
      })

      const replacement = ctx.game._drawAgendaCard()
      return replacement
    }

    return null
  },

  // Commander — Elder Qanoj: +1 vote per readied (non-exhausted) planet you control.
  // Game effects cannot prevent Xxcha from voting on an agenda.
  getVotingModifier(player, _ctx) {
    if (!player.isCommanderUnlocked()) {
      return 0
    }
    const readyPlanets = player.getReadyPlanets()
    return readyPlanets.length
  },

  // Xxcha cannot be excluded from voting by game effects.
  // This is checked in getAgendaParticipation to ensure Xxcha is never in the excluded list.
  cannotBeExcludedFromVoting: true,

  // ---------------------------------------------------------------------------
  // Instinct Training — faction tech (green)
  // When another player plays an action card, you may exhaust this card and
  // spend 1 strategy token to cancel that action card.
  // ---------------------------------------------------------------------------
  onActionCardPlayed(xxchaPlayer, ctx, { playingPlayer, card }) {
    if (playingPlayer.name === xxchaPlayer.name) {
      return false
    }

    if (!xxchaPlayer.hasTechnology('instinct-training')) {
      return false
    }

    if (!ctx.game._isTechReady(xxchaPlayer, 'instinct-training')) {
      return false
    }

    if (xxchaPlayer.commandTokens.strategy < 1) {
      return false
    }

    const choice = ctx.actions.choose(xxchaPlayer, ['Cancel', 'Pass'], {
      title: `Instinct Training: Cancel "${card.name}"? (Exhaust tech + spend 1 strategy token)`,
    })

    if (choice[0] === 'Cancel') {
      ctx.game._exhaustTech(xxchaPlayer, 'instinct-training')
      xxchaPlayer.commandTokens.strategy -= 1

      ctx.log.add({
        template: '{player} uses Instinct Training: cancels {card}',
        args: { player: xxchaPlayer.name, card: card.name },
      })

      return true // card was cancelled
    }

    return false
  },

  // ---------------------------------------------------------------------------
  // Nullification Field — faction tech (yellow)
  // After another player activates a system that contains 1 or more of your
  // ships, you may exhaust this card and spend 1 strategy token to immediately
  // end that player's turn.
  // ---------------------------------------------------------------------------
  onAnySystemActivated(xxchaPlayer, ctx, { systemId, activatingPlayer }) {
    if (activatingPlayer.name === xxchaPlayer.name) {
      return
    }

    if (!xxchaPlayer.hasTechnology('nullification-field')) {
      return
    }

    if (!ctx.game._isTechReady(xxchaPlayer, 'nullification-field')) {
      return
    }

    if (xxchaPlayer.commandTokens.strategy < 1) {
      return
    }

    // Check if Xxcha has ships in the activated system
    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return
    }

    const xxchaShips = systemUnits.space.filter(u => u.owner === xxchaPlayer.name)
    if (xxchaShips.length === 0) {
      return
    }

    const choice = ctx.actions.choose(xxchaPlayer, ['Nullify', 'Pass'], {
      title: `Nullification Field: End ${activatingPlayer.name}'s turn? (Exhaust tech + spend 1 strategy token)`,
    })

    if (choice[0] === 'Nullify') {
      ctx.game._exhaustTech(xxchaPlayer, 'nullification-field')
      xxchaPlayer.commandTokens.strategy -= 1

      ctx.log.add({
        template: '{player} uses Nullification Field: ends {target} turn immediately',
        args: { player: xxchaPlayer.name, target: activatingPlayer.name },
      })

      // Signal that the activating player's turn should end immediately
      ctx.state.nullificationFieldActive = true
    }
  },

  // ---------------------------------------------------------------------------
  // Hero — Xxekir Grom: PLANETARY DEFENSE NEXUS
  // ACTION: Place any combination of up to 4 PDS or mechs on planets you
  // control; ready each planet that you place a unit on. Then, purge this card.
  // ---------------------------------------------------------------------------
  componentActions: [
    {
      id: 'xxekir-grom-hero',
      name: 'Xxekir Grom',
      abilityId: 'peace-accords',
      isAvailable: function(player) {
        return player.isHeroUnlocked() && !player.isHeroPurged()
      },
    },
  ],

  xxekirGromHero(ctx, player) {
    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length === 0) {
      player.purgeHero()
      ctx.log.add({
        template: '{player} purges Xxekir Grom (no controlled planets)',
        args: { player: player.name },
      })
      return
    }

    let unitsPlaced = 0
    const readiedPlanets = new Set()

    for (let i = 0; i < 4; i++) {
      const choices = ['Done', ...controlledPlanets.map(p => `pds:${p}`), ...controlledPlanets.map(p => `mech:${p}`)]
      const selection = ctx.actions.choose(player, choices, {
        title: `Xxekir Grom: Place unit ${i + 1}/4 (PDS or Mech)`,
      })

      if (selection[0] === 'Done') {
        break
      }

      const [unitType, planetId] = selection[0].split(':')
      const systemId = ctx.game._findSystemForPlanet(planetId)

      if (systemId) {
        ctx.game._addUnitToPlanet(systemId, planetId, unitType, player.name)
        unitsPlaced++

        // Ready the planet where the unit was placed
        if (ctx.state.planets[planetId]) {
          ctx.state.planets[planetId].exhausted = false
          readiedPlanets.add(planetId)
        }
      }
    }

    if (unitsPlaced > 0) {
      ctx.log.add({
        template: 'Xxekir Grom: {player} places {count} units, readies {planets} planet(s)',
        args: { player: player.name, count: unitsPlaced, planets: readiedPlanets.size },
      })
    }

    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Xxekir Grom',
      args: { player: player.name },
    })
  },
}
