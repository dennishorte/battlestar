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

describe('Status Phase', () => {
  describe('Command Token Redistribution', () => {
    test('command tokens removed from board during status phase', () => {
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

      // Dennis activates a system (places command token)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
      })

      // Verify token was placed
      expect(game.state.systems[target].commandTokens).toContain('dennis')

      // Complete action phase: both use strategy cards then pass
      t.choose(game, 'Strategic Action')  // micah
      t.choose(game, 'Strategic Action')  // dennis
      t.choose(game, 'Pass')              // micah
      t.choose(game, 'Pass')              // dennis

      // Status phase: redistribute tokens
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Command tokens should be cleared from board
      expect(game.state.systems[target].commandTokens).toEqual([])
    })

    test('all planets readied during status phase', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: [],
              'jord': ['space-dock'],
            },
          },
          planets: {
            'jord': { exhausted: true },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Verify jord starts exhausted
      expect(game.state.planets['jord'].exhausted).toBe(true)

      // Both use strategy cards then pass
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase
      t.choose(game, 'Done')
      t.choose(game, 'Done')

      // Planets should be readied
      expect(game.state.planets['jord'].exhausted).toBe(false)
    })

    test('damaged units repaired during status phase', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')

      // Dennis dreadnought vs micah's cruisers — dreadnought may sustain damage
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['dreadnought'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [target]: {
              space: ['cruiser', 'cruiser', 'cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'dreadnought', from: 'sol-home', count: 1 }],
      })

      // Complete action phase
      t.choose(game, 'Strategic Action')  // micah
      t.choose(game, 'Strategic Action')  // dennis
      t.choose(game, 'Pass')              // micah
      t.choose(game, 'Pass')              // dennis

      // Status phase
      t.choose(game, 'Done')
      t.choose(game, 'Done')

      // All units should be repaired
      for (const systemId of Object.keys(game.state.units)) {
        for (const unit of game.state.units[systemId].space) {
          expect(unit.damaged).toBe(false)
        }
      }
    })

    test('strategy cards returned during status phase', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Both use strategy cards then pass
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase
      t.choose(game, 'Done')
      t.choose(game, 'Done')

      // Strategy cards should be returned
      expect(game.players.byName('dennis').getStrategyCards()).toEqual([])
      expect(game.players.byName('micah').getStrategyCards()).toEqual([])
    })

    test('round increments after status phase', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      t.choose(game, 'Done')
      t.choose(game, 'Done')

      expect(game.state.round).toBe(2)
      expect(game.state.phase).toBe('strategy')
    })
  })
})
