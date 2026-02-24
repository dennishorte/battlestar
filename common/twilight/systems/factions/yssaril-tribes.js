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
