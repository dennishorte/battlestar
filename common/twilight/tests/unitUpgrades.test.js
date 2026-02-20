const t = require('../testutil.js')
const res = require('../res/index.js')

describe('Unit Upgrades', () => {
  describe('_getUnitStats', () => {
    test('returns base stats when no upgrade researched', () => {
      const game = t.fixture()
      game.run()

      const stats = game._getUnitStats('dennis', 'infantry')
      expect(stats.combat).toBe(8)  // base infantry combat
    })

    test('returns upgraded combat for infantry II', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['infantry-ii'],
        },
      })
      game.run()

      const stats = game._getUnitStats('dennis', 'infantry')
      expect(stats.combat).toBe(7)  // infantry II combat
    })

    test('returns upgraded stats for carrier II', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['carrier-ii'],
        },
      })
      game.run()

      const stats = game._getUnitStats('dennis', 'carrier')
      expect(stats.move).toBe(2)      // upgraded from 1
      expect(stats.capacity).toBe(6)  // upgraded from 4
    })

    test('returns upgraded abilities for destroyer II', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['destroyer-ii'],
        },
      })
      game.run()

      const stats = game._getUnitStats('dennis', 'destroyer')
      expect(stats.combat).toBe(8)  // upgraded from 9
      expect(stats.abilities).toContain('anti-fighter-barrage-6x3')
    })

    test('does not upgrade for other players', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['infantry-ii'],
        },
      })
      game.run()

      // Dennis has the upgrade
      expect(game._getUnitStats('dennis', 'infantry').combat).toBe(7)
      // Micah does not
      expect(game._getUnitStats('micah', 'infantry').combat).toBe(8)
    })

    test('faction unit upgrade overrides generic', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['spec-ops-ii'],  // Sol infantry upgrade: combat 6
        },
      })
      game.run()

      const stats = game._getUnitStats('dennis', 'infantry')
      expect(stats.combat).toBe(6)
    })

    test('cruiser II gets capacity', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['cruiser-ii'],
        },
      })
      game.run()

      const stats = game._getUnitStats('dennis', 'cruiser')
      expect(stats.combat).toBe(6)
      expect(stats.move).toBe(3)
      expect(stats.capacity).toBe(1)
    })

    test('fighter II does not require capacity', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['fighter-ii'],
        },
      })
      game.run()

      const stats = game._getUnitStats('dennis', 'fighter')
      expect(stats.combat).toBe(8)
      expect(stats.move).toBe(2)
      expect(stats.requiresCapacity).toBe(false)
    })

    test('space dock II increases production value', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['space-dock-ii'],
        },
      })
      game.run()

      const stats = game._getUnitStats('dennis', 'space-dock')
      expect(stats.productionValue).toBe(4)
    })

    test('PDS II upgrades abilities', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['pds-ii'],
        },
      })
      game.run()

      const stats = game._getUnitStats('dennis', 'pds')
      expect(stats.abilities).toContain('space-cannon-5x1')
      expect(stats.abilities).toContain('planetary-shield')
    })
  })

  describe('Combat with upgrades', () => {
    test('upgraded infantry has better combat value', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['infantry-ii'],
        },
      })
      game.run()

      // Infantry II: combat 7 (instead of 8)
      const stats = game._getUnitStats('dennis', 'infantry')
      expect(stats.combat).toBe(7)

      // Micah still has base infantry
      expect(game._getUnitStats('micah', 'infantry').combat).toBe(8)
    })

    test('upgraded destroyer has better AFB', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['destroyer-ii'],
        },
      })
      game.run()

      const stats = game._getUnitStats('dennis', 'destroyer')
      // Destroyer II: anti-fighter-barrage-6x3 (3 dice at 6+)
      // Base destroyer: anti-fighter-barrage-9x2 (2 dice at 9+)
      expect(stats.abilities).toContain('anti-fighter-barrage-6x3')
      expect(stats.abilities).not.toContain('anti-fighter-barrage-9x2')
    })

    test('advanced carrier II gains sustain damage', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['advanced-carrier-ii'],
        },
      })
      game.run()

      const stats = game._getUnitStats('dennis', 'carrier')
      expect(stats.abilities).toContain('sustain-damage')
      expect(stats.capacity).toBe(8)
      expect(stats.move).toBe(2)
    })
  })

  describe('Movement with upgrades', () => {
    test('carrier II can move 2 systems', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['carrier-ii'],
          units: {
            'system-sol': {
              space: ['carrier'],
              'jord': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()

      // Carrier II has move 2, so it can reach further systems
      const stats = game._getUnitStats('dennis', 'carrier')
      expect(stats.move).toBe(2)
    })

    test('fighter II can move independently', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['fighter-ii'],
        },
      })
      game.run()

      const stats = game._getUnitStats('dennis', 'fighter')
      expect(stats.move).toBe(2)
      expect(stats.requiresCapacity).toBe(false)
    })
  })

  describe('Production with upgrades', () => {
    test('space dock II increases production capacity', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['space-dock-ii'],
        },
      })
      game.run()

      // Space Dock II: productionValue = 4 (instead of 2)
      // Production capacity = planet resources + productionValue
      const stats = game._getUnitStats('dennis', 'space-dock')
      expect(stats.productionValue).toBe(4)
    })
  })

  describe('Technology data', () => {
    test('all generic unit upgrades have stats', () => {
      const upgrades = res.getUnitUpgrades()
      const nonWarSun = upgrades.filter(u => u.id !== 'war-sun')
      for (const upgrade of upgrades) {
        expect(upgrade.unitUpgrade).toBeTruthy()
      }
      // All non-war-sun upgrades have stats
      for (const upgrade of nonWarSun) {
        expect(upgrade.stats).toBeTruthy()
      }
    })

    test('unit upgrade types match existing unit types', () => {
      const upgrades = res.getUnitUpgrades()
      for (const upgrade of upgrades) {
        const baseUnit = res.getUnit(upgrade.unitUpgrade)
        expect(baseUnit).toBeTruthy()
      }
    })
  })
})
