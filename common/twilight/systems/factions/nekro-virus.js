module.exports = {
  canResearchNormally() {
    return false
  },
  isExcludedFromVoting: true,

  // Agent — Nekro Malleon: component action during action phase
  componentActions: [
    {
      id: 'nekro-malleon',
      name: 'Nekro Malleon',
      abilityId: 'galactic-threat', // Any Nekro ability — just needs to match
      isAvailable: function(player) {
        return player.isAgentReady()
      },
    },
  ],

  nekroMalleon(ctx, player) {
    player.exhaustAgent()

    const others = ctx.players.all().filter(p => p.name !== player.name)
    const targetChoices = others.map(p => p.name)

    const targetSelection = ctx.actions.choose(player, targetChoices, {
      title: 'Nekro Malleon: Choose a player',
    })
    const targetName = targetSelection[0]
    const target = ctx.players.byName(targetName)

    // The chosen player decides: discard action card, spend command token, or decline
    const options = []
    const hasActionCards = (target.actionCards || []).length > 0
    if (hasActionCards) {
      options.push('Discard Action Card')
    }
    const totalTokens = target.commandTokens.tactics + target.commandTokens.fleet + target.commandTokens.strategy
    if (totalTokens > 0) {
      options.push('Spend Command Token')
    }
    options.push('Decline')

    if (options.length === 1) {
      // Only 'Decline' available — no action cards, no tokens
      ctx.log.add({
        template: 'Nekro Malleon: {player} targets {target}, but {target} has nothing to give',
        args: { player: player.name, target: targetName },
      })
      return
    }

    const choice = ctx.actions.choose(target, options, {
      title: 'Nekro Malleon: Discard 1 action card or spend 1 command token to gain 2 trade goods?',
    })

    if (choice[0] === 'Discard Action Card') {
      const cards = target.actionCards || []
      const cardChoices = cards.map(c => c.id)
      const cardSelection = ctx.actions.choose(target, cardChoices, {
        title: 'Choose action card to discard',
      })
      const cardId = cardSelection[0]
      target.actionCards = target.actionCards.filter(c => c.id !== cardId)
      target.addTradeGoods(2)

      ctx.log.add({
        template: 'Nekro Malleon: {target} discards an action card and gains 2 trade goods',
        args: { player: player.name, target: targetName },
      })
    }
    else if (choice[0] === 'Spend Command Token') {
      const poolChoices = []
      if (target.commandTokens.tactics > 0) {
        poolChoices.push('tactics')
      }
      if (target.commandTokens.fleet > 0) {
        poolChoices.push('fleet')
      }
      if (target.commandTokens.strategy > 0) {
        poolChoices.push('strategy')
      }

      const poolSelection = ctx.actions.choose(target, poolChoices, {
        title: 'Spend command token from which pool?',
      })
      const pool = poolSelection[0]
      target.commandTokens[pool]--
      target.addTradeGoods(2)

      ctx.log.add({
        template: 'Nekro Malleon: {target} spends 1 {pool} command token and gains 2 trade goods',
        args: { player: player.name, target: targetName, pool },
      })
    }
    else {
      ctx.log.add({
        template: 'Nekro Malleon: {target} declines',
        args: { player: player.name, target: targetName },
      })
    }
  },

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

  onAgendaOutcomeResolved(player, ctx, { winningOutcome, playerVotes }) {
    if (!ctx.state.nekroPrediction) {
      return
    }
    if (ctx.state.nekroPrediction.playerName !== player.name) {
      return
    }

    const { outcome } = ctx.state.nekroPrediction
    ctx.state.nekroPrediction = null

    if (outcome !== winningOutcome) {
      ctx.log.add({
        template: '{player} predicted incorrectly (Galactic Threat)',
        args: { player },
      })
      return
    }

    // Only consider techs from players who voted for the predicted outcome
    const eligibleVoters = Object.entries(playerVotes || {})
      .filter(([name, vote]) => vote.outcome === winningOutcome && name !== player.name)
      .map(([name]) => name)

    const allTechs = []
    for (const voterName of eligibleVoters) {
      const voter = ctx.players.byName(voterName)
      if (!voter) {
        continue
      }
      for (const techId of voter.getTechIds()) {
        if (!player.hasTechnology(techId)) {
          allTechs.push(techId)
        }
      }
    }

    const unique = [...new Set(allTechs)]
    if (unique.length === 0) {
      ctx.log.add({
        template: '{player} predicted correctly but no copyable technologies from eligible voters (Galactic Threat)',
        args: { player },
      })
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
