module.exports = {
  // Guild Ships: trade with non-neighbors
  canTradeWithNonNeighbors() {
    return true
  },

  // Masters of Trade: free Trade secondary
  canSkipTradeSecondaryCost() {
    return true
  },

  // Arbiters: action cards can be traded
  canTradeActionCards() {
    return true
  },

  // Agent: Carth of Golden Sands — component action to gain 2 commodities or replenish another
  componentActions: [
    {
      id: 'carth-agent',
      name: 'Carth of Golden Sands',
      abilityId: 'guild-ships', // Any Hacan ability, just needs to match
      isAvailable: function(player) {
        return player.isAgentReady()
      },
    },
    {
      id: 'harrugh-gefhara-hero',
      name: 'Harrugh Gefhara',
      abilityId: 'guild-ships',
      isAvailable: function(player) {
        return player.isHeroUnlocked() && !player.isHeroPurged()
      },
    },
  ],

  carthAgent(ctx, player) {
    player.exhaustAgent()

    const others = ctx.players.all().filter(p => p.name !== player.name).map(p => p.name)
    const options = ['Gain 2 Commodities', ...others.map(n => `Replenish ${n}`)]

    const choice = ctx.actions.choose(player, options, {
      title: 'Carth of Golden Sands: Gain 2 commodities or replenish another player?',
    })

    if (choice[0] === 'Gain 2 Commodities') {
      const toGain = Math.min(2, player.maxCommodities - player.commodities)
      player.commodities += toGain
      ctx.log.add({
        template: 'Carth of Golden Sands: {player} gains {count} commodities',
        args: { player: player.name, count: toGain },
      })
    }
    else {
      // Replenish another player's commodities
      const targetName = choice[0].replace('Replenish ', '')
      const target = ctx.players.byName(targetName)
      if (target) {
        target.commodities = target.maxCommodities
        ctx.log.add({
          template: 'Carth of Golden Sands: {player} replenishes {target} commodities',
          args: { player: player.name, target: targetName },
        })
      }
    }
  },

  // Quantum Datahub Node: at end of strategy phase, may swap strategy cards with another player
  onStrategyPhaseEnd(player, ctx) {
    if (!player.hasTechnology('quantum-datahub-node')) {
      return
    }

    // Must have at least 1 strategy token and 3 trade goods
    if (player.commandTokens.strategy < 1 || player.tradeGoods < 3) {
      return
    }

    const others = ctx.players.all().filter(p => p.name !== player.name)
    if (others.length === 0) {
      return
    }

    const choices = ['Pass', ...others.map(p => p.name)]
    const selection = ctx.actions.choose(player, choices, {
      title: 'Quantum Datahub Node: Spend 1 strategy token and give 3 TG to swap strategy cards?',
    })

    if (selection[0] === 'Pass') {
      return
    }

    const targetName = selection[0]
    const target = ctx.players.byName(targetName)
    if (!target) {
      return
    }

    // Pay cost: 1 strategy token and 3 trade goods (given to target)
    player.commandTokens.strategy -= 1
    player.spendTradeGoods(3)
    target.addTradeGoods(3)

    // Swap strategy cards
    const playerCards = player.getStrategyCards()
    const targetCards = target.getStrategyCards()

    // Choose which of your cards to give
    let giveCard
    if (playerCards.length === 1) {
      giveCard = playerCards[0]
    }
    else {
      const cardSel = ctx.actions.choose(player, playerCards, {
        title: 'Choose your strategy card to give:',
      })
      giveCard = cardSel[0]
    }

    // Choose which of their cards to take
    let takeCard
    if (targetCards.length === 1) {
      takeCard = targetCards[0]
    }
    else {
      const cardSel = ctx.actions.choose(player, targetCards, {
        title: 'Choose their strategy card to take:',
      })
      takeCard = cardSel[0]
    }

    // Perform the swap
    player.returnStrategyCard()
    target.returnStrategyCard()

    // Re-assign: player gets all their old cards minus giveCard plus takeCard
    const newPlayerCards = playerCards.filter(c => c !== giveCard).concat([takeCard])
    const newTargetCards = targetCards.filter(c => c !== takeCard).concat([giveCard])

    for (const cardId of newPlayerCards) {
      player.pickStrategyCard(cardId)
    }
    for (const cardId of newTargetCards) {
      target.pickStrategyCard(cardId)
    }

    ctx.log.add({
      template: '{player} uses Quantum Datahub Node: gives {giveCard} to {target}, takes {takeCard}',
      args: { player: player.name, target: targetName, giveCard, takeCard },
    })
  },

  // ---------------------------------------------------------------------------
  // Auto-Factories — faction tech
  // When you produce 3 or more non-fighter ships, place 1 command token from
  // your reinforcements into your fleet pool.
  // Also clears hero production override after production.
  // ---------------------------------------------------------------------------
  afterProduction(player, ctx, { producedUnits }) {
    // Clear hero flag after production step completes
    if (ctx.state.hacanHeroActive === player.name) {
      delete ctx.state.hacanHeroActive
    }

    if (!player.hasTechnology('auto-factories')) {
      return
    }

    if (!producedUnits || producedUnits.length === 0) {
      return
    }

    // Count non-fighter ships produced
    const nonFighterShips = producedUnits.filter(
      u => u.category === 'ship' && u.type !== 'fighter'
    )

    if (nonFighterShips.length >= 3) {
      player.commandTokens.fleet += 1

      ctx.log.add({
        template: 'Auto-Factories: {player} gains 1 fleet supply token ({count} non-fighter ships produced)',
        args: { player: player.name, count: nonFighterShips.length },
      })
    }
  },

  // ---------------------------------------------------------------------------
  // Hero — Harrugh Gefhara: GALACTIC SECURITIES NET
  // ACTION: Your total production cost is 0 for this turn.
  // When you next produce units this turn, they cost 0. Then purge this card.
  // ---------------------------------------------------------------------------
  harrughGefharaHero(ctx, player) {
    // Set a flag that modifies production cost to 0 for this turn
    ctx.state.hacanHeroActive = player.name

    ctx.log.add({
      template: 'Harrugh Gefhara: {player} production cost is 0 for this turn',
      args: { player: player.name },
    })

    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Harrugh Gefhara',
      args: { player: player.name },
    })
  },

  // Override production cost to 0 when hero is active
  getProductionCostOverride(player, ctx, _unitType) {
    if (ctx.state.hacanHeroActive === player.name) {
      return 0
    }
    return null
  },

  // Commander: Gila the Silvertongue — when casting votes, may spend TG for 2 extra votes each
  getTradeGoodVoteRate(player, _ctx) {
    if (!player.isCommanderUnlocked()) {
      return 0
    }
    return 2
  },

  // Commander effect for transaction bonus (when a player replenishes commodities while you have traded with them)
  commanderEffect: {
    timing: 'transaction-bonus',
    apply: (player, _context) => {
      player.addTradeGoods(1)
    },
  },
}
