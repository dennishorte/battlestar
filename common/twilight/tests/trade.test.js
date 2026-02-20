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
