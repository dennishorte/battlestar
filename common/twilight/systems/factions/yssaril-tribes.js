module.exports = {
  getActionCardHandLimit() {
    return Infinity
  },

  componentActions: [
    {
      id: 'stall-tactics',
      name: 'Stall Tactics',
      abilityId: 'stall-tactics',
      isAvailable: (player) => (player.actionCards || []).length > 0,
    },
    {
      id: 'mageon-implants',
      name: 'Mageon Implants',
      abilityId: 'stall-tactics',  // reuse faction ability ID for availability gate
      isAvailable: function(player) {
        if (!player.hasTechnology('mageon-implants')) {
          return false
        }
        if ((player.exhaustedTechs || []).includes('mageon-implants')) {
          return false
        }
        // Must have at least one opponent with action cards
        const allPlayers = player.game?.players?.all() || []
        return allPlayers.some(p =>
          p.name !== player.name && (p.actionCards || []).length > 0
        )
      },
    },
    {
      id: 'yssaril-hero',
      name: 'Kyver, Blade and Key',
      abilityId: 'stall-tactics',  // reuse faction ability ID for availability gate
      isAvailable: function(player) {
        return player.isHeroUnlocked() && !player.isHeroPurged()
      },
    },
  ],

  stallTactics(ctx, player) {
    const cards = player.actionCards || []
    if (cards.length === 0) {
      return
    }

    const choices = cards.map(c => ctx.actions.option({ id: c.id, title: c.id, kind: 'action-card' }))
    const selection = ctx.actions.choose(player, choices, {
      title: 'Discard Action Card (Stall Tactics)',
    })

    const selPick = selection[0]
    const cardId = (selPick && typeof selPick === 'object') ? selPick.id : selPick
    player.actionCards = cards.filter(c => c.id !== cardId)

    ctx.log.add({
      template: '{player} uses Stall Tactics: discards an action card',
      args: { player },
    })

    // Mech DEPLOY — Blackshade Infiltrator: after using Stall Tactics,
    // may place 1 mech on a controlled planet
    this._blackshadeInfiltratorDeploy(ctx, player)
  },

  // Blackshade Infiltrator DEPLOY
  _blackshadeInfiltratorDeploy(ctx, player) {
    if (!ctx.game._hasReinforcementsAvailable(player.name, 'mech')) {
      return
    }

    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length === 0) {
      return
    }

    const mechChoice = ctx.actions.choose(player, [
      ctx.actions.option({ id: 'deploy', title: 'Deploy Blackshade Infiltrator' }),
      ctx.actions.option({ id: 'pass', title: 'Pass' }),
    ], {
      title: 'Blackshade Infiltrator DEPLOY: Place 1 mech on a controlled planet?',
    })

    const mechPick = mechChoice[0]
    const mechPickId = (mechPick && typeof mechPick === 'object') ? mechPick.id : mechPick
    if (mechPickId !== 'deploy' && mechPick !== 'Deploy Blackshade Infiltrator') {
      return
    }

    let targetPlanet
    if (controlledPlanets.length === 1) {
      targetPlanet = controlledPlanets[0]
    }
    else {
      const planetSelection = ctx.actions.choose(
        player,
        controlledPlanets.map(p => ctx.actions.option({ id: p, title: p, kind: 'planet' })),
        {
          title: 'Blackshade Infiltrator: Choose planet',
        },
      )
      const planetPick = planetSelection[0]
      targetPlanet = (planetPick && typeof planetPick === 'object') ? planetPick.id : planetPick
    }

    const systemId = ctx.game._findSystemForPlanet(targetPlanet)
    if (systemId) {
      ctx.game._addUnitToPlanet(systemId, targetPlanet, 'mech', player.name)
      ctx.log.add({
        template: 'Blackshade Infiltrator: {player} deploys mech on {planet}',
        args: { player: player.name, planet: targetPlanet },
      })
    }
  },

  // ---------------------------------------------------------------------------
  // Commander — So Ata: After another player activates a system that contains
  // 1 or more of your units: Look at that player's action cards.
  // ---------------------------------------------------------------------------

  onAnySystemActivated(yssarilPlayer, ctx, { systemId, activatingPlayer }) {
    // Agent — Ssruu: has text ability of each other player's agent.
    // At system activation, may copy another faction's agent ability.
    if (yssarilPlayer.isAgentReady()) {
      this._offerSsruuSystemActivation(yssarilPlayer, ctx, { systemId, activatingPlayer })
    }

    // Commander — So Ata: only triggers for other players
    if (!activatingPlayer || activatingPlayer.name === yssarilPlayer.name) {
      return
    }

    if (!yssarilPlayer.isCommanderUnlocked()) {
      return
    }

    // Check if Yssaril has units in the activated system
    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return
    }

    const hasUnitsInSystem = systemUnits.space.some(u => u.owner === yssarilPlayer.name) ||
      Object.values(systemUnits.planets).some(pu =>
        pu.some(u => u.owner === yssarilPlayer.name)
      )

    if (!hasUnitsInSystem) {
      return
    }

    // Reveal the activating player's action cards
    const cards = activatingPlayer.actionCards || []
    const cardNames = cards.map(c => c.name || c.id)

    ctx.log.add({
      template: "So Ata: {player} sees {target}'s action cards ({count}): {cards}",
      args: {
        player: yssarilPlayer.name,
        target: activatingPlayer.name,
        count: cards.length,
        cards: cardNames.join(', ') || 'none',
      },
    })
  },

  // ---------------------------------------------------------------------------
  // Agent — Ssruu: This card has the text ability of each other player's
  // agent, even if that agent is exhausted.
  // ---------------------------------------------------------------------------

  _offerSsruuSystemActivation(yssarilPlayer, ctx, { systemId, activatingPlayer }) {
    const { getHandler } = require('./index.js')
    const otherPlayers = ctx.game.players.all().filter(p => p.name !== yssarilPlayer.name)

    const available = []
    for (const other of otherPlayers) {
      const agentName = other.faction?.leaders?.agent?.name
      if (!agentName) {
        continue
      }

      const handler = getHandler(other.faction.id)
      if (!handler?.onAnySystemActivated) {
        continue
      }

      available.push({ label: agentName, factionId: other.faction.id })
    }

    if (available.length === 0) {
      return
    }

    const choices = available.map((a, i) => ctx.actions.option({
      id: `ssruu:${a.factionId}:${i}`,
      title: `Ssruu as ${a.label}`,
      kind: 'ssruu',
    }))
    choices.push(ctx.actions.option({ id: 'pass', title: 'Pass' }))

    const sel = ctx.actions.choose(yssarilPlayer, choices, {
      title: "Ssruu: Copy an agent's ability?",
    })

    const ssruuPick = sel[0]
    const ssruuPickId = (ssruuPick && typeof ssruuPick === 'object') ? ssruuPick.id : ssruuPick
    const ssruuPickTitle = (ssruuPick && typeof ssruuPick === 'object') ? ssruuPick.title : ssruuPick
    if (ssruuPickId === 'pass' || ssruuPickTitle === 'Pass') {
      return
    }

    yssarilPlayer.exhaustAgent()

    let chosen
    if (typeof ssruuPickId === 'string' && ssruuPickId.startsWith('ssruu:')) {
      const parts = ssruuPickId.split(':')
      const idx = parseInt(parts[2], 10)
      chosen = available[idx]
    }
    else {
      const idx = choices.findIndex(c => c.title === ssruuPickTitle)
      chosen = available[idx]
    }
    this._executeSsruuEffect(yssarilPlayer, ctx, chosen.factionId, { systemId, activatingPlayer })
  },

  _executeSsruuEffect(yssarilPlayer, ctx, factionId, { systemId: _systemId, activatingPlayer }) {
    switch (factionId) {
      case 'empyrean': {
        // Acamar: gain 1 TG or give activating player 1 command token
        const effectChoices = [
          ctx.actions.option({ id: 'tg', title: 'Gain 1 Trade Good' }),
          ctx.actions.option({ id: 'token', title: `Give ${activatingPlayer.name} 1 Command Token` }),
        ]
        const effectChoice = ctx.actions.choose(yssarilPlayer, effectChoices, {
          title: 'Ssruu (Acamar): Choose effect',
        })

        const effPick = effectChoice[0]
        const effPickId = (effPick && typeof effPick === 'object') ? effPick.id : effPick
        const effPickTitle = (effPick && typeof effPick === 'object') ? effPick.title : effPick
        if (effPickId === 'tg' || effPickTitle === 'Gain 1 Trade Good') {
          yssarilPlayer.addTradeGoods(1)
        }
        else {
          const target = ctx.players.byName(activatingPlayer.name)
          if (target) {
            target.commandTokens.tactics += 1
          }
        }
        ctx.log.add({
          template: 'Ssruu (as Acamar): {player} chose {effect}',
          args: { player: yssarilPlayer.name, effect: effPickTitle },
        })
        break
      }
      default:
        ctx.log.add({
          template: 'Ssruu: {player} copies {faction} agent ability',
          args: { player: yssarilPlayer.name, faction: factionId },
        })
    }
  },

  // ---------------------------------------------------------------------------
  // Hero — Kyver, Blade and Key: GUILD OF SPIES
  // ACTION: Each other player shows you 1 action card from their hand.
  // For each player, you may either take that card or force that player to
  // discard 3 random action cards. Then, purge this card.
  // ---------------------------------------------------------------------------

  yssarilHero(ctx, player) {
    const opponents = ctx.game.players.all()
      .filter(p => p.name !== player.name)

    for (const opponent of opponents) {
      const opponentCards = opponent.actionCards || []
      if (opponentCards.length === 0) {
        ctx.log.add({
          template: 'Guild of Spies: {target} has no action cards',
          args: { target: opponent.name },
        })
        continue
      }

      // Opponent shows 1 card (game chooses first card; in real game opponent chooses)
      const showChoices = opponentCards.map(c => ctx.actions.option({ id: c.id, title: c.id, kind: 'action-card' }))
      const shown = ctx.actions.choose(opponent, showChoices, {
        title: 'Guild of Spies: Choose 1 action card to show',
      })
      const shownPick = shown[0]
      const shownCardId = (shownPick && typeof shownPick === 'object') ? shownPick.id : shownPick

      // Yssaril player decides: take it, or force discard 3
      const actionChoices = [ctx.actions.option({ id: 'take', title: `Take ${shownCardId}` })]
      if (opponentCards.length >= 3) {
        actionChoices.push(ctx.actions.option({ id: 'discard', title: 'Force Discard 3' }))
      }
      actionChoices.push(ctx.actions.option({ id: 'pass', title: 'Pass' }))

      const decision = ctx.actions.choose(player, actionChoices, {
        title: `Guild of Spies: ${opponent.name} shows ${shownCardId}`,
      })

      const decPick = decision[0]
      const decPickId = (decPick && typeof decPick === 'object') ? decPick.id : decPick
      const decPickTitle = (decPick && typeof decPick === 'object') ? decPick.title : decPick
      if (decPickId === 'take' || (typeof decPickTitle === 'string' && decPickTitle.startsWith('Take '))) {
        // Take the shown card
        const cardIdx = opponent.actionCards.findIndex(c => c.id === shownCardId)
        if (cardIdx !== -1) {
          const takenCard = opponent.actionCards.splice(cardIdx, 1)[0]
          if (!player.actionCards) {
            player.actionCards = []
          }
          player.actionCards.push(takenCard)
          ctx.log.add({
            template: 'Guild of Spies: {player} takes action card from {target}',
            args: { player: player.name, target: opponent.name },
          })
        }
      }
      else if (decPickId === 'discard' || decPickTitle === 'Force Discard 3') {
        // Force opponent to discard 3 random action cards
        const discardCount = Math.min(3, opponent.actionCards.length)
        for (let i = 0; i < discardCount; i++) {
          const randomIdx = Math.floor(ctx.game.random() * opponent.actionCards.length)
          opponent.actionCards.splice(randomIdx, 1)
        }
        ctx.log.add({
          template: 'Guild of Spies: {target} discards {count} action cards',
          args: { target: opponent.name, count: discardCount },
        })
      }
    }

    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Kyver, Blade and Key',
      args: { player: player.name },
    })
  },

  // Mageon Implants (faction tech): ACTION — Exhaust to look at another
  // player's hand of action cards. Choose 1 of those cards and add it to
  // your hand.
  mageonImplants(ctx, player) {
    ctx.game._exhaustTech(player, 'mageon-implants')

    // Choose an opponent
    const opponents = ctx.game.players.all()
      .filter(p => p.name !== player.name && (p.actionCards || []).length > 0)

    if (opponents.length === 0) {
      ctx.log.add({
        template: 'Mageon Implants: no opponents have action cards',
        args: {},
      })
      return
    }

    const targetSelection = ctx.actions.choose(player, opponents.map(p => ctx.actions.playerOption(p)), {
      title: 'Mageon Implants: Choose opponent to look at',
    })
    const targetPick = targetSelection[0]
    const targetName = (targetPick && typeof targetPick === 'object') ? targetPick.id : targetPick
    const target = ctx.game.players.byName(targetName)

    const targetCards = target.actionCards || []
    if (targetCards.length === 0) {
      return
    }

    const cardChoices = targetCards.map(c => ctx.actions.option({ id: c.id, title: c.id, kind: 'action-card' }))
    const cardSelection = ctx.actions.choose(player, cardChoices, {
      title: `Mageon Implants: Take 1 action card from ${targetName}`,
    })

    const cardPick = cardSelection[0]
    const cardId = (cardPick && typeof cardPick === 'object') ? cardPick.id : cardPick
    const cardIdx = target.actionCards.findIndex(c => c.id === cardId)
    if (cardIdx !== -1) {
      const stolenCard = target.actionCards.splice(cardIdx, 1)[0]
      if (!player.actionCards) {
        player.actionCards = []
      }
      player.actionCards.push(stolenCard)
    }

    ctx.log.add({
      template: 'Mageon Implants: {player} takes 1 action card from {target}',
      args: { player: player.name, target: targetName },
    })
  },

  onActionCardDraw(player, ctx, drawn) {
    if (drawn.length === 0) {
      return
    }

    ctx.game._initActionCardDeck()
    if (ctx.state.actionCardDeck.length > 0) {
      const bonus = ctx.state.actionCardDeck.pop()
      player.actionCards.push(bonus)

      ctx.log.add({
        template: '{player} draws 1 extra card (Scheming): {card}',
        args: { player, card: bonus.name },
        visibility: [player.name],
        redacted: '{player} draws 1 extra card (Scheming)',
      })
    }

    const cards = player.actionCards || []
    if (cards.length === 0) {
      return
    }

    const choices = cards.map(c => ctx.actions.option({ id: c.id, title: c.id, kind: 'action-card' }))
    const selection = ctx.actions.choose(player, choices, {
      title: 'Scheming: Discard 1 action card',
    })

    const schemPick = selection[0]
    const cardId = (schemPick && typeof schemPick === 'object') ? schemPick.id : schemPick
    const discarded = cards.find(c => c.id === cardId)
    player.actionCards = player.actionCards.filter(c => c.id !== cardId)

    ctx.log.add({
      template: '{player} discards {card} (Scheming)',
      args: { player, card: discarded?.name || cardId },
      visibility: [player.name],
      redacted: '{player} discards 1 action card (Scheming)',
    })
  },

  // Transparasteel Plating: During your turn of the action phase, players
  // that have passed cannot play action cards.
  // This is a passive ability checked when action cards are played.
  canPassedPlayersPlayActionCards(player) {
    if (!player.hasTechnology('transparasteel-plating')) {
      return true
    }
    return false
  },
}
