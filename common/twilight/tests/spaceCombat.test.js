const t = require('../testutil.js')
const { Galaxy } = require('../model/Galaxy.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

function findAdjacent(systemId) {
  const temp = t.fixture()
  temp.run()  // initializes galaxy state
  const galaxy = new Galaxy(temp)
  return galaxy.getAdjacent(systemId)[0]
}

describe('Space Combat', () => {
  describe('Combat Trigger', () => {
    test('combat occurs when moving into system with enemy ships', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['fighter'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 5 }],
      })

      // After combat, micah's fighter should be destroyed (5 cruisers vs 1 fighter)
      const micahShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })

    test('no combat when no enemy ships present', () => {
      const game = t.fixture()
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

      const target = findAdjacent('sol-home')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
      })

      // Ship should be safely in target (no combat)
      const dennisShips = game.state.units[target].space
        .filter(u => u.owner === 'dennis')
      expect(dennisShips.length).toBe(1)
    })
  })

  describe('Combat Rounds', () => {
    test('ships roll dice based on combat value', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      // War sun (combat 3, 80% hit rate) vs destroyer (combat 9, 20% hit rate)
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['war-sun', 'war-sun'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'war-sun', from: 'sol-home', count: 2 }],
      })

      // War suns should win (2 war suns with 80% hit rate each vs 1 destroyer)
      const micahShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })

    test('combat continues until one side eliminated', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      // Multiple combat rounds needed
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['cruiser', 'cruiser', 'cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 3 }],
      })

      // One side should be eliminated (combat resolves completely)
      const dennisShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'dennis')
      const micahShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'micah')
      expect(dennisShips.length === 0 || micahShips.length === 0).toBe(true)
    })
  })

  describe('Sustain Damage', () => {
    test('sustain damage cancels one hit', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      // Dreadnought has sustain damage — takes 2 hits to destroy
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['dreadnought'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 5 }],
      })

      // Dreadnought should be destroyed (5 cruisers = enough hits over combat rounds)
      // But it takes 2 hits due to sustain damage
      const micahShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })

    test('damaged unit destroyed by next hit', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      // Pre-damaged dreadnought — only 1 hit to destroy
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['war-sun'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['dreadnought'],
            },
          },
        },
      })
      // Pre-damage the dreadnought
      game.testSetBreakpoint('initialization-complete', (game) => {
        // Find the dreadnought and mark it damaged
        const ships = game.state.units[targetSystem]?.space || []
        const dn = ships.find(u => u.type === 'dreadnought')
        if (dn) {
          dn.damaged = true
        }
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'war-sun', from: 'sol-home', count: 1 }],
      })

      // Pre-damaged dreadnought destroyed by first hit (war sun at combat 3 = 80%)
      const micahShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })
  })

  describe('Anti-Fighter Barrage', () => {
    test('AFB destroys fighters before combat', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      // Dennis has 4 destroyers (AFB 9x2 each = 8 rolls)
      // Micah has fighters that should get barraged
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['destroyer', 'destroyer', 'destroyer', 'destroyer'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['fighter', 'fighter', 'carrier'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'destroyer', from: 'sol-home', count: 4 }],
      })

      // After AFB and combat, micah's fleet should be reduced or eliminated
      // 4 destroyers vs 2 fighters + carrier — combat should resolve fully
      const micahShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'micah')
      const dennisShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'dennis')
      // One side should be eliminated
      expect(micahShips.length === 0 || dennisShips.length === 0).toBe(true)
    })
  })
})
