module.exports = {
  canResearchNormally() {
    return false
  },
  isExcludedFromVoting: true,

  onAgendaVotingStart(player, ctx, { agenda, outcomes }) {
    const choices = outcomes.map(o => `Predict: ${o}`)
    choices.push('No prediction')

    const selection = ctx.actions.choose(player, choices, {
      title: `Galactic Threat: Predict outcome of "${agenda.name}"`,
    })

    if (selection[0] !== 'No prediction') {
      const predicted = selection[0].replace('Predict: ', '')
      ctx.state.nekroPrediction = { playerName: player.name, outcome: predicted }

      ctx.log.add({
        template: '{player} predicts: {outcome} (Galactic Threat)',
        args: { player, outcome: predicted },
      })
    }
  },

  onAgendaOutcomeResolved(player, ctx, { winningOutcome }) {
    if (!ctx.state.nekroPrediction) {
      return
    }
    if (ctx.state.nekroPrediction.playerName !== player.name) {
      return
    }

    const { outcome } = ctx.state.nekroPrediction
    ctx.state.nekroPrediction = null

    if (outcome !== winningOutcome) {
      return
    }

    const allTechs = []
    for (const other of ctx.players.all()) {
      if (other.name === player.name) {
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

    const selection = ctx.actions.choose(player, unique, {
      title: 'Galactic Threat: Correct prediction — choose technology to copy',
    })

    const techId = selection[0]
    ctx.game._grantTechnology(player, techId)

    ctx.log.add({
      template: '{player} gains {tech} (correct Galactic Threat prediction)',
      args: { player, tech: techId },
    })
  },

  onUnitDestroyed(player, ctx, { systemId: _systemId, unit }) {
    // Once per combat
    if (ctx.state._singularityUsedThisCombat) {
      return
    }

    const owner = ctx.players.byName(unit.owner)
    if (!owner) {
      return
    }

    const ownerTechs = owner.getTechIds().filter(id => !player.hasTechnology(id))
    if (ownerTechs.length === 0) {
      return
    }

    const choices = ['Pass', ...ownerTechs]
    const selection = ctx.actions.choose(player, choices, {
      title: `Technological Singularity: Copy a technology from ${unit.owner}?`,
    })

    if (selection[0] === 'Pass') {
      return
    }

    ctx.state._singularityUsedThisCombat = true
    const techId = selection[0]
    ctx.game._grantTechnology(player, techId)

    ctx.log.add({
      template: '{player} copies {tech} from {target} (Technological Singularity)',
      args: { player, tech: techId, target: unit.owner },
    })
  },
}
