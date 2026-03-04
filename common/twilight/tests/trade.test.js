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

    test('Trade strategy card replenishes all player commodities', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      // Dennis (trade=5) goes first
      t.choose(game, 'Strategic Action')

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      expect(dennis.commodities).toBe(4)  // Sol max
      expect(micah.commodities).toBe(6)   // Hacan max
    })
  })

  describe('Trade Goods', () => {
    test('Trade strategy card gives 3 trade goods to active player', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      t.choose(game, 'Strategic Action')

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
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens

      // Transaction window: dennis chooses micah
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

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens

      // Dennis offers 2 commodities
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

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens
      // micah: leadership secondary auto-passes (Hacan 2I)

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

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens
      // micah: leadership secondary auto-passes (Hacan 2I)

      // First transaction with micah
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: { tradeGoods: 1 },
        requesting: {},
      })
      t.choose(game, 'Accept')

      // After first transaction, micah is marked as traded.
      // In 2p game, no more partners → loop auto-exits.

      // Micah: strategic action (new turn = fresh tracking)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')

      // Micah can propose to dennis (fresh turn)
      t.choose(game, 'dennis')
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
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens

      // If transaction prompt appeared, this next choose would fail
      t.choose(game, 'Strategic Action')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')  // dennis declines
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Should reach status phase
      expect(game.state.phase).toBe('status')
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

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens
      // micah: leadership secondary auto-passes (Hacan 2I)

      // Skip transaction
      t.choose(game, 'Skip Transaction')

      // Resources unchanged
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
