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

    const choices = cards.map(c => c.id)
    const selection = ctx.actions.choose(player, choices, {
      title: 'Discard Action Card (Stall Tactics)',
    })

    const cardId = selection[0]
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
    // Check if player has mechs available (simplified: always allow)
    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length === 0) {
      return
    }

    const mechChoice = ctx.actions.choose(player, ['Deploy Blackshade Infiltrator', 'Pass'], {
      title: 'Blackshade Infiltrator DEPLOY: Place 1 mech on a controlled planet?',
    })

    if (mechChoice[0] !== 'Deploy Blackshade Infiltrator') {
      return
    }

    let targetPlanet
    if (controlledPlanets.length === 1) {
      targetPlanet = controlledPlanets[0]
    }
    else {
      const planetSelection = ctx.actions.choose(player, controlledPlanets, {
        title: 'Blackshade Infiltrator: Choose planet',
      })
      targetPlanet = planetSelection[0]
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
    // Only triggers for other players
    if (!activatingPlayer || activatingPlayer.name === yssarilPlayer.name) {
      return
    }

    // Commander must be unlocked
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
      const showChoices = opponentCards.map(c => c.id)
      const shown = ctx.actions.choose(opponent, showChoices, {
        title: 'Guild of Spies: Choose 1 action card to show',
      })
      const shownCardId = shown[0]

      // Yssaril player decides: take it, or force discard 3
      const actionChoices = [`Take ${shownCardId}`]
      if (opponentCards.length >= 3) {
        actionChoices.push('Force Discard 3')
      }
      actionChoices.push('Pass')

      const decision = ctx.actions.choose(player, actionChoices, {
        title: `Guild of Spies: ${opponent.name} shows ${shownCardId}`,
      })

      if (decision[0].startsWith('Take ')) {
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
      else if (decision[0] === 'Force Discard 3') {
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

    const opponentNames = opponents.map(p => p.name)
    const targetSelection = ctx.actions.choose(player, opponentNames, {
      title: 'Mageon Implants: Choose opponent to look at',
    })
    const targetName = targetSelection[0]
    const target = ctx.game.players.byName(targetName)

    const targetCards = target.actionCards || []
    if (targetCards.length === 0) {
      return
    }

    const cardChoices = targetCards.map(c => c.id)
    const cardSelection = ctx.actions.choose(player, cardChoices, {
      title: `Mageon Implants: Take 1 action card from ${targetName}`,
    })

    const cardId = cardSelection[0]
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
        template: '{player} draws 1 extra card (Scheming)',
        args: { player },
      })
    }

    const cards = player.actionCards || []
    if (cards.length === 0) {
      return
    }

    const choices = cards.map(c => c.id)
    const selection = ctx.actions.choose(player, choices, {
      title: 'Scheming: Discard 1 action card',
    })

    const cardId = selection[0]
    player.actionCards = player.actionCards.filter(c => c.id !== cardId)
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
