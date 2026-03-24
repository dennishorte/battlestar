const t = require('../testutil.js')
const { Galaxy } = require('../model/Galaxy.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

function findAdjacent(systemId) {
  const temp = t.fixture()
  temp.run()
  const galaxy = new Galaxy(temp)
  return galaxy.getAdjacent(systemId)[0]
}

describe('Trade System', () => {
  describe('Commodities', () => {
    test('commodities set to faction max on replenish', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.commodities).toBe(0)

      dennis.replenishCommodities()
      // Sol has 4 max commodities
      expect(dennis.commodities).toBe(4)
    })

    test('Hacan has 6 max commodities', () => {
      const game = t.fixture()
      game.run()

      const micah = game.players.byName('micah')
      micah.replenishCommodities()
      expect(micah.commodities).toBe(6)
    })

    test('Trade primary lets active player choose who gets free secondary', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      // Dennis (trade=5) goes first
      t.choose(game, 'Strategic Action.trade')

      // Dennis chooses micah for free secondary (only other player, loop auto-exits)
      t.choose(game, 'micah')

      // Micah accepts free secondary
      t.choose(game, 'Use Secondary')

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      expect(dennis.commodities).toBe(4)  // Sol max (primary)
      expect(micah.commodities).toBe(6)   // Hacan max (free secondary)
      expect(micah.commandTokens.strategy).toBe(2)  // no token spent (free)
    })

    test('unchosen players must spend strategy token for Trade secondary', () => {
      // Use two non-Hacan factions (Hacan always gets free Trade secondary)
      const game = t.fixture({ factions: ['federation-of-sol', 'sardakk-norr'] })
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      t.choose(game, 'Strategic Action.trade')

      // Dennis chooses nobody for free secondary
      t.choose(game)

      // Micah uses secondary — costs strategy token
      t.choose(game, 'Use Secondary')

      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(3)  // Sardakk N'orr max commodities
      expect(micah.commandTokens.strategy).toBe(1)  // spent 1 of 2
    })
  })

  describe('Trade Goods', () => {
    test('Trade strategy card gives 3 trade goods to active player', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      t.choose(game, 'Strategic Action.trade')

      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(3)

      // Other player does NOT get trade goods from primary
      const micah = game.players.byName('micah')
      expect(micah.tradeGoods).toBe(0)
    })

    test('trade goods can be spent on production', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          tradeGoods: 2,
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'sol-home': {
              space: [],
              'jord': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'sol-home' })
      t.choose(game, 'Done')

      // Produce using planet resources (4) + trade goods (2) = 6 total
      // 3 cruisers cost 2 each = 6
      t.action(game, 'produce-units', {
        units: [{ type: 'cruiser', count: 3 }],
      })

      const cruisers = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis' && u.type === 'cruiser')
      expect(cruisers.length).toBe(3)

      // Trade goods should be spent
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(0)
    })
  })

  describe('Neighbors', () => {
    test('players with units in same system are neighbors', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          units: {
            [target]: { space: ['cruiser'] },
          },
        },
        micah: {
          units: {
            [target]: { space: ['cruiser'] },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(game.areNeighbors(dennis.name, 'micah')).toBe(true)
    })

    test('players with units in adjacent systems are neighbors', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          units: {
            [target]: { space: ['cruiser'] },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(game.areNeighbors(dennis.name, 'micah')).toBe(true)
    })

    test('players without nearby units are not neighbors', () => {
      const game = t.fixture()
      game.run()

      // Players only have units in their home systems
      // In 2-player layout, home systems are at opposite sides of the ring
      // and should not be adjacent
      const dennis = game.players.byName('dennis')
      expect(game.areNeighbors(dennis.name, 'micah')).toBe(false)
    })
  })

  describe('Transactions', () => {
    test('active player can propose transaction to neighbor', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          tradeGoods: 3,
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          commodities: 4,
          units: {
            [target]: { space: ['cruiser'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis takes leadership
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate tokens

      // Micah's turn: do diplomacy to advance to dennis's next turn
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'hacan-home')

      // Dennis's turn: Propose Transaction from the Choose Action prompt
      t.choose(game, 'Propose Transaction')
      t.choose(game, 'micah')

      // Dennis offers 1 trade good, requests 2 commodities
      t.action(game, 'trade-offer', {
        offering: { tradeGoods: 1 },
        requesting: { commodities: 2 },
      })

      // Micah accepts
      t.choose(game, 'Accept')

      // Verify results
      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      expect(dennis.tradeGoods).toBe(4)  // 3 - 1 + 2 (commodities → trade goods)
      expect(micah.tradeGoods).toBe(1)   // 0 + 1 (received trade good)
      expect(micah.commodities).toBe(2)  // 4 - 2

      // No more neighbors to trade with (2-player game), so loop exits automatically
    })

    test('commodities convert to trade goods on receipt', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          commodities: 3,
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          tradeGoods: 0,
          units: {
            [target]: { space: ['cruiser'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate tokens

      // Micah's turn: do diplomacy to advance to dennis's next turn
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'hacan-home')

      // Dennis offers 2 commodities
      t.choose(game, 'Propose Transaction')
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: { commodities: 2 },
        requesting: {},
      })
      t.choose(game, 'Accept')

      const micah = game.players.byName('micah')
      expect(micah.tradeGoods).toBe(2)   // commodities → trade goods
      expect(micah.commodities).toBe(0)  // unchanged (Hacan started at 0)

      const dennis = game.players.byName('dennis')
      expect(dennis.commodities).toBe(1)  // 3 - 2
    })

    test('target can reject transaction', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          tradeGoods: 3,
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          tradeGoods: 1,
          units: {
            [target]: { space: ['cruiser'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate tokens

      // Micah's turn: do diplomacy to advance to dennis's next turn
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'hacan-home')

      t.choose(game, 'Propose Transaction')
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: { tradeGoods: 1 },
        requesting: { tradeGoods: 1 },
      })
      t.choose(game, 'Reject')

      // No resources should have changed
      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      expect(dennis.tradeGoods).toBe(3)
      expect(micah.tradeGoods).toBe(1)

      // Rejected transaction still counts — no more partners in 2p game
    })

    test('one transaction per neighbor per turn', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          tradeGoods: 5,
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          tradeGoods: 5,
          units: {
            [target]: { space: ['cruiser'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate tokens

      // Micah's turn: propose transaction to dennis
      t.choose(game, 'Propose Transaction')
      t.choose(game, 'dennis')
      t.action(game, 'trade-offer', {
        offering: { tradeGoods: 1 },
        requesting: {},
      })
      t.choose(game, 'Accept')

      // After first transaction, dennis is marked as traded for micah.
      // In 2p game, no more partners → Propose Transaction won't appear.
      // Micah continues with diplomacy
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'hacan-home')

      // Dennis's turn: can propose to micah (fresh turn for dennis)
      t.choose(game, 'Propose Transaction')
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: { tradeGoods: 1 },
        requesting: {},
      })
      t.choose(game, 'Accept')

      // Both pass
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')
    })

    test('transaction not offered when players are not neighbors', () => {
      const game = t.fixture()
      // Default setup: players in separate home systems, not adjacent
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis takes leadership - no transaction prompt should appear
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate tokens

      // If transaction prompt appeared, this next choose would fail
      t.choose(game, 'Strategic Action.diplomacy')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      // dennis: diplomacy secondary auto-skipped (no exhausted planets)
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Should reach status phase
      expect(game.state.phase).toBe('status')
    })

    test('target can counter-offer', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          tradeGoods: 3,
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          tradeGoods: 2,
          commodities: 3,
          units: {
            [target]: { space: ['cruiser'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')

      // Micah's turn: do diplomacy to advance to dennis's next turn
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'hacan-home')

      // Dennis proposes: offer 1 TG, request 2 commodities
      t.choose(game, 'Propose Transaction')
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: { tradeGoods: 1 },
        requesting: { commodities: 2 },
      })

      // Micah counters: offer 1 commodity, request 1 TG
      t.choose(game, 'Counter')
      t.action(game, 'trade-offer', {
        offering: { commodities: 1 },
        requesting: { tradeGoods: 1 },
      })

      // Dennis accepts the counter
      t.choose(game, 'Accept')

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      expect(dennis.tradeGoods).toBe(3)  // 3 - 1 + 1 (commodity → TG)
      expect(micah.tradeGoods).toBe(3)   // 2 + 1
      expect(micah.commodities).toBe(2)  // 3 - 1
    })

    test('original player can reject counter-offer', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          tradeGoods: 3,
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          tradeGoods: 2,
          commodities: 3,
          units: {
            [target]: { space: ['cruiser'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')

      // Micah's turn: do diplomacy to advance to dennis's next turn
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'hacan-home')

      t.choose(game, 'Propose Transaction')
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: { tradeGoods: 1 },
        requesting: { commodities: 2 },
      })

      // Micah counters
      t.choose(game, 'Counter')
      t.action(game, 'trade-offer', {
        offering: { commodities: 1 },
        requesting: { tradeGoods: 3 },
      })

      // Dennis rejects the counter
      t.choose(game, 'Reject')

      // No resources changed
      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      expect(dennis.tradeGoods).toBe(3)
      expect(micah.tradeGoods).toBe(2)
      expect(micah.commodities).toBe(3)
    })

    test('skip transaction without proposing', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          tradeGoods: 3,
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          tradeGoods: 1,
          units: {
            [target]: { space: ['cruiser'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate tokens
      // micah: leadership secondary auto-passes (Hacan 2I)

      // Propose Transaction is available but not required — player can just take another action
      const choices = t.currentChoices(game)
      expect(choices).toContain('Propose Transaction')

      // Resources unchanged — no transaction proposed
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(3)
    })
  })

  describe('Player Resources', () => {
    test('getTotalResources sums ready planet resources', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      // Sol starts with Jord (4 resources), which is ready
      expect(dennis.getTotalResources()).toBe(4)
    })

    test('exhausted planets do not contribute resources', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          planets: {
            'jord': { exhausted: true },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.getTotalResources()).toBe(0)
    })

    test('getTotalInfluence sums ready planet influence', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      // Sol starts with Jord (2 influence)
      expect(dennis.getTotalInfluence()).toBe(2)
    })
  })
})
