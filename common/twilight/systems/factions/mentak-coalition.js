module.exports = {
  // Ambush: At the start of space combat, roll 1 die for each of up to 2 of
  // your cruisers or destroyers. For each result >= that ship's combat value,
  // produce 1 hit; opponent must assign hits to their ships.
  onSpaceCombatStart(player, ctx, { systemId, opponentName }) {
    const systemUnits = ctx.state.units[systemId]

    // --- Hero: Ipswitch, Loose Cannon — SLEEPER CELL ---
    // At the start of space combat: purge to place copies of destroyed enemy
    // ships during this combat
    if (player.isHeroUnlocked() && !player.isHeroPurged()) {
      const heroChoice = ctx.actions.choose(player, ['Activate Sleeper Cell', 'Pass'], {
        title: 'Ipswitch, Loose Cannon: Purge to copy destroyed enemy ships during this combat?',
      })
      if (heroChoice[0] === 'Activate Sleeper Cell') {
        ctx.state._mentakSleeperCell = player.name
        player.purgeHero()
        ctx.log.add({
          template: 'Sleeper Cell: {player} activates Ipswitch',
          args: { player: player.name },
        })
      }
    }

    // --- Ambush ---
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

  // Sleeper Cell: after combat resolves, place copies of destroyed enemy ships
  afterCombatResolved(player, ctx, { systemId, combatType }) {
    if (combatType !== 'space') {
      return
    }
    if (ctx.state._mentakSleeperCell !== player.name) {
      return
    }

    const destroyedTypes = ctx.state._destroyedDuringCombat || {}
    // Collect all ship types destroyed by the opponent (not by Mentak)
    const opponentDestroyed = []
    for (const [ownerName, types] of Object.entries(destroyedTypes)) {
      if (ownerName !== player.name) {
        for (const type of types) {
          opponentDestroyed.push(type)
        }
      }
    }

    if (opponentDestroyed.length > 0) {
      for (const shipType of opponentDestroyed) {
        ctx.game._addUnit(systemId, 'space', shipType, player.name)
      }
      ctx.log.add({
        template: 'Sleeper Cell: {player} places {count} ships from destroyed enemy fleet',
        args: { player: player.name, count: opponentDestroyed.length },
      })
    }

    delete ctx.state._mentakSleeperCell
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

  // Salvage Operations (faction tech): After you win or lose a space combat,
  // gain 1 trade good; if you won, you may also produce 1 ship in that system
  // of any ship type that was destroyed during the combat.
  onCombatEnd(player, ctx, { systemId, opponentName: _opponentName, combatType, won, destroyedTypes }) {
    if (!player.hasTechnology('salvage-operations')) {
      return
    }

    // Only triggers after space combat
    if (combatType !== 'space') {
      return
    }

    // Gain 1 trade good (win or lose)
    player.addTradeGoods(1)
    ctx.log.add({
      template: 'Salvage Operations: {player} gains 1 trade good',
      args: { player: player.name },
    })

    // If won, may produce 1 ship of a destroyed type
    if (won && destroyedTypes) {
      // Collect all unique ship types destroyed by any player during this combat
      const allDestroyed = new Set()
      for (const types of Object.values(destroyedTypes)) {
        for (const type of types) {
          allDestroyed.add(type)
        }
      }

      if (allDestroyed.size > 0) {
        const choices = ['Pass', ...allDestroyed]
        const selection = ctx.actions.choose(player, choices, {
          title: 'Salvage Operations: Produce 1 ship of a destroyed type?',
        })

        if (selection[0] !== 'Pass') {
          const shipType = selection[0]
          ctx.game._addUnit(systemId, 'space', shipType, player.name)
          ctx.log.add({
            template: 'Salvage Operations: {player} produces 1 {ship}',
            args: { player: player.name, ship: shipType },
          })
        }
      }
    }
  },

  // Mirror Computing (faction tech): When you spend trade goods,
  // each trade good is worth 2 resources or influence instead of 1.
  getTradeGoodResourceValue(player, _ctx) {
    if (player.hasTechnology('mirror-computing')) {
      return 2
    }
    return 1
  },
}
