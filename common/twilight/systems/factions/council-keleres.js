module.exports = {
  onTurnStart(player, ctx) {
    if (!ctx.state.activeLaws || ctx.state.activeLaws.length === 0) {
      return
    }
    if (player.getTotalInfluence() < 1) {
      return
    }

    const choice = ctx.actions.choose(player, ['Blank Laws', 'Pass'], {
      title: "Law's Order: Spend 1 influence to blank all laws this turn?",
    })

    if (choice[0] === 'Blank Laws') {
      ctx.game._payInfluence(player, 1)
      ctx.state.lawsBlankedByPlayer = player.name

      ctx.log.add({
        template: "{player} uses Law's Order: all laws blanked this turn",
        args: { player },
      })
    }
  },

  onStrategyPhaseStart(player, ctx) {
    player.replenishCommodities()
    player.addTradeGoods(1)

    ctx.log.add({
      template: '{player} replenishes commodities and gains 1 TG (Council Patronage)',
      args: { player },
    })
  },
}
