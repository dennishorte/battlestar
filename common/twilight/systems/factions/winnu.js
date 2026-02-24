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

  // Commander — Berekar Berekon: When you control Mecatol Rex, apply +1 to
  // combat rolls and gain 1 additional command token during the status phase.

  _controlsMecatolRex(player, ctx) {
    return ctx.state.planets['mecatol-rex']?.controller === player.name
  },

  getCombatModifier(player, ctx) {
    if (!player.isCommanderUnlocked()) {
      return 0
    }
    if (!this._controlsMecatolRex(player, ctx)) {
      return 0
    }
    // Negative = bonus (lower combat threshold)
    return -1
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
    apply: (player, context) => {
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
}
