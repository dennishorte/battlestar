module.exports = {
  // Ambush: At the start of space combat, roll 1 die for each of up to 2 of
  // your cruisers or destroyers. For each result >= that ship's combat value,
  // produce 1 hit; opponent must assign hits to their ships.
  onSpaceCombatStart(player, ctx, { systemId, opponentName }) {
    const systemUnits = ctx.state.units[systemId]

    // Find eligible ships: cruisers and destroyers belonging to this player
    const eligible = systemUnits.space.filter(
      u => u.owner === player.name && (u.type === 'cruiser' || u.type === 'destroyer')
    )
    if (eligible.length === 0) {
      return
    }

    // Roll for up to 2 eligible ships
    const ambushShips = eligible.slice(0, 2)
    let hits = 0
    for (const ship of ambushShips) {
      const unitDef = ctx.game._getUnitStats(ship.owner, ship.type)
      if (!unitDef || !unitDef.combat) {
        continue
      }
      const roll = Math.floor(ctx.game.random() * 10) + 1
      if (roll >= unitDef.combat) {
        hits++
      }
    }

    if (hits > 0) {
      ctx.log.add({
        template: '{shooter} Ambush scores {hits} hit(s)',
        args: { shooter: player.name, hits },
      })

      // Opponent assigns hits to their ships
      ctx.game._assignHits(systemId, opponentName, hits, player.name)
    }
    else {
      ctx.log.add({
        template: '{shooter} Ambush misses',
        args: { shooter: player.name },
      })
    }
  },

  // Pillage: After a neighbor gains trade goods or resolves a transaction,
  // if they have 3 or more trade goods, you may take 1 of their TG or commodities.
  onTransactionComplete(player, ctx, transactionPlayer) {
    if (!ctx.game.areNeighbors(player.name, transactionPlayer.name)) {
      return
    }

    // Pillage requires the target to have 3 or more trade goods
    if (transactionPlayer.tradeGoods < 3) {
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
      this._offerAgent(player, ctx, transactionPlayer)
    }
    else if (selection[0] === 'Steal Commodity') {
      transactionPlayer.commodities -= 1
      player.addTradeGoods(1)
      ctx.log.add({
        template: '{mentak} pillages 1 commodity from {target}',
        args: { mentak: player, target: transactionPlayer },
      })
      this._offerAgent(player, ctx, transactionPlayer)
    }
  },

  // Agent — Suffi An: After Pillage is used, exhaust to have both players
  // draw 1 action card each.
  _offerAgent(player, ctx, pillagedPlayer) {
    if (!player.isAgentReady()) {
      return
    }

    const choice = ctx.actions.choose(player, ['Exhaust Suffi An', 'Pass'], {
      title: 'Suffi An: Exhaust to draw 1 action card each?',
    })

    if (choice[0] !== 'Exhaust Suffi An') {
      return
    }

    player.exhaustAgent()
    ctx.game._drawActionCards(player, 1)
    ctx.game._drawActionCards(pillagedPlayer, 1)

    ctx.log.add({
      template: 'Suffi An: {mentak} and {target} each draw 1 action card',
      args: { mentak: player, target: pillagedPlayer },
    })
  },
}
