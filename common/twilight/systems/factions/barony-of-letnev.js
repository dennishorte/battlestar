module.exports = {
  onSpaceCombatRound(player, ctx, { systemId, opponentName: _opponentName }) {
    if (player.tradeGoods < 2) {
      return
    }

    const systemUnits = ctx.state.units[systemId]
    const hasShips = systemUnits.space.some(u => u.owner === player.name)
    if (!hasShips) {
      return
    }

    const choice = ctx.actions.choose(player, ['Reroll', 'Pass'], {
      title: 'Munitions Reserves: Spend 2 trade goods to reroll dice?',
    })

    if (choice[0] === 'Reroll') {
      player.spendTradeGoods(2)
      ctx.log.add({
        template: '{player} spends 2 trade goods for Munitions Reserves reroll',
        args: { player },
      })
    }
  },

  commanderEffect: {
    timing: 'spend-token-alternative',
    apply: (player, _context) => {
      return player.tradeGoods >= 2
    },
  },
}
