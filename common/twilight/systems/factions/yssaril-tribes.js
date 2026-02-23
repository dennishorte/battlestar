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
}
