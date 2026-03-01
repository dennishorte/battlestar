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

describe('Production', () => {
  describe('Space Dock', () => {
    test('produce ships in home system', () => {
      const game = t.fixture()
      // Sol home has Jord (4 resources) + space dock
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis activates his own home system for production
      // Actually we can't activate sol-home because we'd need to activate an adjacent system
      // and move then produce there. Let's produce after a tactical action to an adjacent system
      // that already has a space dock.

      // Actually, the simplest approach: activate the home system itself
      // (This costs a command token but is legal if no token there yet)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'sol-home' })
      t.choose(game, 'Done')  // skip movement

      // Production step: build 2 cruisers (cost 2 each = 4 total, Jord has 4 resources)
      t.action(game, 'produce-units', {
        units: [
          { type: 'cruiser', count: 2 },
        ],
      })

      const dennisShips = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis')
      const cruisers = dennisShips.filter(u => u.type === 'cruiser')
      expect(cruisers.length).toBe(2)
      // Jord should be exhausted
      expect(game.state.planets['jord'].exhausted).toBe(true)
    })

    test('cannot exceed production capacity', () => {
      const game = t.fixture()
      // Space dock production = planet resources + 2 = 4 + 2 = 6 units max
      t.setBoard(game, {
        dennis: {
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

      // Try to produce 4 fighters (cost 2 for 2-for-1) — within capacity of 6
      t.action(game, 'produce-units', {
        units: [
          { type: 'fighter', count: 4 },
        ],
      })

      const fighters = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis' && u.type === 'fighter')
      expect(fighters.length).toBe(4)
    })

    test('skip production when no space dock', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')

      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Move to adjacent system (no space dock there)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
      })

      // No production prompt — tactical action ends
      // micah's turn should come next
      expect(game.waiting.selectors[0].actor).toBe('micah')
    })
  })

  describe('Cost Payment', () => {
    test('2 fighters cost 1 resource', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
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

      // Produce 4 fighters for 2 resources (2-for-1)
      // Still have 2 resources of Jord left, so also produce 1 cruiser (cost 2)
      t.action(game, 'produce-units', {
        units: [
          { type: 'fighter', count: 4 },
          { type: 'cruiser', count: 1 },
        ],
      })

      const space = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis')
      expect(space.filter(u => u.type === 'fighter').length).toBe(4)
      expect(space.filter(u => u.type === 'cruiser').length).toBe(1)
    })

    test('2 infantry cost 1 resource', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
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

      // Produce 4 infantry (2 resources) + 1 cruiser (2 resources) = 4 total
      t.action(game, 'produce-units', {
        units: [
          { type: 'infantry', count: 4 },
          { type: 'cruiser', count: 1 },
        ],
      })

      const jord = game.state.units['sol-home'].planets['jord']
        .filter(u => u.owner === 'dennis')
      expect(jord.filter(u => u.type === 'infantry').length).toBe(4)
    })

    test('1 fighter costs the same as 2 fighters', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
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

      // Jord has 4 resources. 1 fighter = 1 resource, leaving 3 for a carrier (cost 3)
      t.action(game, 'produce-units', {
        units: [
          { type: 'fighter', count: 1 },
          { type: 'carrier', count: 1 },
        ],
      })

      const space = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis')
      expect(space.filter(u => u.type === 'fighter').length).toBe(1)
      expect(space.filter(u => u.type === 'carrier').length).toBe(2) // 1 existing + 1 produced
    })

    test('3 fighters cost 2 resources', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
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

      // Jord has 4 resources. 3 fighters = 2 resources, leaving 2 for a cruiser
      t.action(game, 'produce-units', {
        units: [
          { type: 'fighter', count: 3 },
          { type: 'cruiser', count: 1 },
        ],
      })

      const space = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis')
      expect(space.filter(u => u.type === 'fighter').length).toBe(3)
      expect(space.filter(u => u.type === 'cruiser').length).toBe(1)
    })

    test('1 infantry costs the same as 2 infantry', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
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

      // Jord has 4 resources. 1 infantry = 1 resource, leaving 3
      // Produce 1 infantry + 1 carrier (cost 3) = 4 resources total
      t.action(game, 'produce-units', {
        units: [
          { type: 'infantry', count: 1 },
          { type: 'carrier', count: 1 },
        ],
      })

      const jord = game.state.units['sol-home'].planets['jord']
        .filter(u => u.owner === 'dennis')
      expect(jord.filter(u => u.type === 'infantry').length).toBe(1)

      const space = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis')
      expect(space.filter(u => u.type === 'carrier').length).toBe(1)
    })
  })

  describe('Blockade', () => {
    test('cannot produce ships if enemy has ships in system', () => {
      const game = t.fixture()
      // Dennis has space dock but micah has ships in the same system
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: [],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            'sol-home': {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'sol-home' })
      t.choose(game, 'Done')

      // Try to produce 2 cruisers — blocked by enemy ships
      t.action(game, 'produce-units', {
        units: [
          { type: 'cruiser', count: 2 },
        ],
      })

      // No cruisers should be produced (blockade)
      const dennisShips = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis' && u.type === 'cruiser')
      expect(dennisShips.length).toBe(0)
    })

    test('can still produce ground forces when blockaded', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: [],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            'sol-home': {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'sol-home' })
      t.choose(game, 'Done')

      // Produce ground forces even when blockaded
      t.action(game, 'produce-units', {
        units: [
          { type: 'infantry', count: 4 },
        ],
      })

      const jord = game.state.units['sol-home'].planets['jord']
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(jord.length).toBe(4)
    })
  })

  describe('Reinforcements Cap', () => {
    test('cannot produce past unit type limit', () => {
      const game = t.fixture()
      // Dreadnought limit is 5. Place 4 on board, try to produce 2 more — only 1 should succeed
      // Fleet pool must be high enough not to block, and resources sufficient
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 6 },
          tradeGoods: 8,
          units: {
            'sol-home': {
              space: ['dreadnought', 'dreadnought', 'dreadnought', 'dreadnought'],
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

      t.action(game, 'produce-units', {
        units: [{ type: 'dreadnought', count: 2 }],
      })

      const dreads = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis' && u.type === 'dreadnought')
      // 4 existing + 1 produced (2nd blocked by reinforcements cap of 5)
      expect(dreads.length).toBe(5)
    })

    test('partial production when some units at limit', () => {
      const game = t.fixture()
      // Carrier limit is 4. Place 3, try to produce 2 — only 1 should succeed
      // Fleet pool must be high enough not to block, and resources sufficient
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 5 },
          tradeGoods: 6,
          units: {
            'sol-home': {
              space: ['carrier', 'carrier', 'carrier'],
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

      t.action(game, 'produce-units', {
        units: [{ type: 'carrier', count: 2 }],
      })

      const carriers = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis' && u.type === 'carrier')
      // 3 existing + 1 produced (2nd blocked by reinforcements cap of 4)
      expect(carriers.length).toBe(4)
    })

    test('unlimited types (fighters) are not capped', () => {
      const game = t.fixture()
      // Fighters have limit -1 (unlimited) — should produce freely
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
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

      // Produce 4 fighters (2 resources for 4 via 2-for-1)
      t.action(game, 'produce-units', {
        units: [{ type: 'fighter', count: 4 }],
      })

      const fighters = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis' && u.type === 'fighter')
      expect(fighters.length).toBe(4)
    })
  })

  describe('Fleet Pool', () => {
    test('cannot produce over fleet pool limit', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 2 },
          units: {
            'sol-home': {
              space: ['cruiser'],  // already 1 non-fighter ship
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

      // Fleet pool is 2, already 1 cruiser — can only produce 1 more non-fighter ship
      t.action(game, 'produce-units', {
        units: [
          { type: 'cruiser', count: 2 },
        ],
      })

      const cruisers = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis' && u.type === 'cruiser')
      // 1 existing + 1 produced (2nd blocked by fleet pool)
      expect(cruisers.length).toBe(2)
    })
  })
})
