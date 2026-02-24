module.exports = {
  getCustodiansCost() {
    return 0
  },

  onPlanetGained(player, ctx, { planetId, systemId }) {
    if (planetId !== 'mecatol-rex') {
      return
    }

    ctx.game._addUnitToPlanet(systemId, planetId, 'pds', player.name)
    ctx.game._addUnitToPlanet(systemId, planetId, 'space-dock', player.name)

    ctx.log.add({
      template: '{player} uses Reclamation: PDS and space dock on Mecatol Rex',
      args: { player },
    })
  },

  // Mech — Reclaimer DEPLOY: After another player gains control of a planet
  // you control, you may place 1 mech from your reinforcements on that planet.
  onPlanetLost(player, ctx, { planetId, systemId, gainingPlayerName: _gainingPlayerName }) {
    const choice = ctx.actions.choose(player, ['Deploy Mech', 'Pass'], {
      title: `Reclaimer: Deploy 1 mech on ${planetId}?`,
    })

    if (choice[0] === 'Pass') {
      return
    }

    ctx.game._addUnitToPlanet(systemId, planetId, 'mech', player.name)

    ctx.log.add({
      template: 'Reclaimer: {player} deploys 1 mech on {planet}',
      args: { player: player.name, planet: planetId },
    })
  },

  // Commander — Berekar Berekon: When you control Mecatol Rex, apply +1 to
  // combat rolls and gain 1 additional command token during the status phase.

  _controlsMecatolRex(player, ctx) {
    return ctx.state.planets['mecatol-rex']?.controller === player.name
  },

  getCombatModifier(player, ctx) {
    let modifier = 0

    // Commander: +1 combat when controlling Mecatol Rex
    if (player.isCommanderUnlocked() && this._controlsMecatolRex(player, ctx)) {
      modifier -= 1
    }

    // Imperator: +1 to combat per Support for the Throne in opponents' play areas
    if (player.hasTechnology('imperator')) {
      for (const other of ctx.players.all()) {
        if (other.name === player.name) {
          continue
        }
        const notes = other.getPromissoryNotes()
        const sftCount = notes.filter(n => n.id === 'support-for-the-throne').length
        modifier -= sftCount // negative = bonus (lower combat threshold)
      }
    }

    return modifier
  },

  getStatusPhaseTokenBonus(player, ctx) {
    if (!player.isCommanderUnlocked()) {
      return 0
    }
    if (!this._controlsMecatolRex(player, ctx)) {
      return 0
    }
    return 1
  },

  commanderEffect: {
    timing: 'combat-modifier',
    apply: (player, _context) => {
      // The combat modifier is already handled by getCombatModifier;
      // this registration enables Mahact Imperia to copy the effect.
      // Check Mecatol Rex control via planet state on the game.
      const planets = player.game?.state?.planets
      if (!planets?.['mecatol-rex'] || planets['mecatol-rex'].controller !== player.name) {
        return 0
      }
      return 1
    },
  },

  // ---------------------------------------------------------------------------
  // Lazax Gate Folding (faction tech)
  // ---------------------------------------------------------------------------
  // If you do not control Mecatol Rex, treat its system as if it contains
  // both an alpha and beta wormhole.
  // ACTION: If you control Mecatol Rex, exhaust this card to place 1 infantry
  // from your reinforcements on Mecatol Rex.

  getHomeSystemWormholes(player, ctx, systemId) {
    if (!player.hasTechnology('lazax-gate-folding')) {
      return []
    }
    // Only applies to the Mecatol Rex system (tile 18)
    if (String(systemId) !== '18') {
      return []
    }
    // Only when Winnu does NOT control Mecatol Rex
    if (this._controlsMecatolRex(player, ctx)) {
      return []
    }
    return ['alpha', 'beta']
  },

  // ---------------------------------------------------------------------------
  // Hegemonic Trade Policy (faction tech)
  // ---------------------------------------------------------------------------
  // Exhaust this card when 1 or more of your units use PRODUCTION; swap the
  // resource and influence values of 1 planet you control during that use of
  // Production.
  //
  // Implementation note: This is registered as a component action that sets a
  // flag. The actual swap is applied during production cost calculation.
  // For simplicity, we implement this as a component action that gives trade
  // goods equal to the difference (influence - resources) for controlled planets,
  // modeling the economic benefit of the swap.

  // ---------------------------------------------------------------------------
  // Component Actions
  // ---------------------------------------------------------------------------

  componentActions: [
    {
      id: 'lazax-gate-folding',
      name: 'Lazax Gate Folding',
      abilityId: 'reclamation',  // available to Winnu (reusing an ability ID they have)
      isAvailable: function(player) {
        // Must have the tech, it must be ready, and must control Mecatol Rex
        if (!player.hasTechnology('lazax-gate-folding')) {
          return false
        }
        if ((player.exhaustedTechs || []).includes('lazax-gate-folding')) {
          return false
        }
        const planets = player.game?.state?.planets
        return planets?.['mecatol-rex']?.controller === player.name
      },
    },
    {
      id: 'hegemonic-trade-policy',
      name: 'Hegemonic Trade Policy',
      abilityId: 'reclamation',
      isAvailable: function(player) {
        if (!player.hasTechnology('hegemonic-trade-policy')) {
          return false
        }
        if ((player.exhaustedTechs || []).includes('hegemonic-trade-policy')) {
          return false
        }
        return true
      },
    },
    {
      id: 'winnu-hero',
      name: 'Mathis Mathinus, Kingmaker',
      abilityId: 'reclamation',
      isAvailable: function(player) {
        return player.isHeroUnlocked() && !player.isHeroPurged()
      },
    },
  ],

  // Lazax Gate Folding component action: place 1 infantry on Mecatol Rex
  lazaxGateFolding(ctx, player) {
    ctx.game._exhaustTech(player, 'lazax-gate-folding')

    ctx.game._addUnitToPlanet('18', 'mecatol-rex', 'infantry', player.name)

    ctx.log.add({
      template: 'Lazax Gate Folding: {player} places 1 infantry on Mecatol Rex',
      args: { player: player.name },
    })
  },

  // Hegemonic Trade Policy component action: swap resource/influence for production
  hegemonicTradePolicy(ctx, player) {
    ctx.game._exhaustTech(player, 'hegemonic-trade-policy')

    // Let the player choose which planet to swap
    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length === 0) {
      return
    }

    const planetChoices = controlledPlanets.map(pId => {
      const planet = ctx.game.res.getPlanet(pId)
      if (planet) {
        return `${pId} (${planet.resources}R/${planet.influence}I)`
      }
      return pId
    })

    const selection = ctx.actions.choose(player, planetChoices, {
      title: 'Hegemonic Trade Policy: Choose planet to swap resource/influence values',
    })

    const planetId = selection[0].split(' (')[0]

    // Store the swap on game state so production can reference it
    if (!ctx.state.hegemonicTradeSwaps) {
      ctx.state.hegemonicTradeSwaps = {}
    }
    ctx.state.hegemonicTradeSwaps[planetId] = player.name

    ctx.log.add({
      template: 'Hegemonic Trade Policy: {player} swaps resource and influence values of {planet}',
      args: { player: player.name, planet: planetId },
    })
  },

  // Winnu Hero: Mathis Mathinus — score 1 public objective you meet requirements for
  winnuHero(ctx, player) {
    const res = require('../../res/index.js')
    const revealedObjectives = ctx.state.revealedObjectives || []
    const playerScored = ctx.state.scoredObjectives[player.name] || []

    // Find which revealed public objectives this player can score
    const scorable = revealedObjectives.filter(objId => {
      if (playerScored.includes(objId)) {
        return false
      }
      const obj = res.getObjective(objId)
      if (!obj || !obj.check) {
        return false
      }
      return obj.check(player, ctx.game)
    })

    if (scorable.length === 0) {
      ctx.log.add({
        template: '{player} uses Mathis Mathinus but no public objectives can be scored',
        args: { player: player.name },
      })
      player.purgeHero()
      return
    }

    const choices = scorable.map(id => {
      const obj = res.getObjective(id)
      return `${id}: ${obj.name}`
    })

    const selection = ctx.actions.choose(player, choices, {
      title: 'Mathis Mathinus: Score 1 public objective',
    })

    const chosen = selection[0]
    ctx.game._recordObjectiveScore(player, chosen)

    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Mathis Mathinus, Kingmaker',
      args: { player: player.name },
    })
  },
}
