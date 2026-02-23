module.exports = {
  onSpaceCombatStart(player, ctx, { systemId, opponentName }) {
    const systemUnits = ctx.state.units[systemId]

    const hasShips = systemUnits.space.some(u => u.owner === player.name && u.type !== 'fighter')
    if (!hasShips) {
      return
    }

    let hits = 0
    for (let i = 0; i < 2; i++) {
      const roll = Math.floor(ctx.game.random() * 10) + 1
      if (roll >= 9) {
        hits++
      }
    }

    if (hits > 0) {
      ctx.log.add({
        template: '{shooter} Ambush scores {hits} hits',
        args: { shooter: player.name, hits },
      })

      for (let i = 0; i < hits; i++) {
        const nonFighters = systemUnits.space
          .filter(u => u.owner === opponentName && u.type !== 'fighter')
          .sort((a, b) => {
            const defA = ctx.game._getUnitStats(a.owner, a.type)
            const defB = ctx.game._getUnitStats(b.owner, b.type)
            return (defA?.cost || 0) - (defB?.cost || 0)
          })

        if (nonFighters.length > 0) {
          const toDestroy = nonFighters[0]
          const idx = systemUnits.space.indexOf(toDestroy)
          if (idx !== -1) {
            systemUnits.space.splice(idx, 1)
          }
        }
      }
    }
  },

  onTransactionComplete(player, ctx, transactionPlayer) {
    if (!ctx.game.areNeighbors(player.name, transactionPlayer.name)) {
      return
    }

    if (transactionPlayer.tradeGoods <= 0 && transactionPlayer.commodities <= 0) {
      return
    }

    const choices = ['Pass']
    if (transactionPlayer.tradeGoods > 0) {
      choices.unshift('Steal Trade Good')
    }
    if (transactionPlayer.commodities > 0) {
      choices.unshift('Steal Commodity')
    }

    const selection = ctx.actions.choose(player, choices, {
      title: `Pillage ${transactionPlayer.name}?`,
    })

    if (selection[0] === 'Steal Trade Good') {
      transactionPlayer.spendTradeGoods(1)
      player.addTradeGoods(1)
      ctx.log.add({
        template: '{mentak} pillages 1 trade good from {target}',
        args: { mentak: player, target: transactionPlayer },
      })
    }
    else if (selection[0] === 'Steal Commodity') {
      transactionPlayer.commodities -= 1
      player.addTradeGoods(1)
      ctx.log.add({
        template: '{mentak} pillages 1 commodity from {target}',
        args: { mentak: player, target: transactionPlayer },
      })
    }
  },
}
