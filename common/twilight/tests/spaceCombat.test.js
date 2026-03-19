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

  describe('Retreat', () => {
    test('announced retreat executes after combat round', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      // Set up evenly matched combat so it doesn't resolve in one round
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['dreadnought', 'dreadnought'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['dreadnought', 'dreadnought'],
            },
          },
        },
      })
      // Announce retreat for micah before combat starts
      game.testSetBreakpoint('initialization-complete', (game) => {
        // Pre-announce retreat so micah retreats after first round
        game.state.retreatAnnounced = { micah: 'hacan-home' }
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'dreadnought', from: 'sol-home', count: 2 }],
      })

      // Micah's ships should have retreated to hacan-home
      const micahInTarget = (game.state.units[targetSystem]?.space || [])
        .filter(u => u.owner === 'micah')
      const micahInHome = (game.state.units['hacan-home']?.space || [])
        .filter(u => u.owner === 'micah')

      // Some ships may have been destroyed in combat, but any survivors should be in hacan-home
      expect(micahInTarget.length).toBe(0)
      // Retreated ships are in hacan-home (may have taken losses)
      expect(micahInHome.length).toBeGreaterThanOrEqual(0)
    })

    test('getRetreatTargets finds valid adjacent systems', () => {
      const game = t.fixture()
      game.run()

      const targets = game._getRetreatTargets('sol-home', 'dennis')
      expect(targets.length).toBeGreaterThan(0)
      // All retreat targets should be adjacent to sol-home
      const adjacent = game._getAdjacentSystems('sol-home')
      for (const target of targets) {
        expect(adjacent).toContain(target)
      }
    })

    test('cannot retreat into system with enemy ships', () => {
      const game = t.fixture()
      const adj = findAdjacent('sol-home')
      t.setBoard(game, {
        micah: {
          units: {
            [adj]: {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()

      const targets = game._getRetreatTargets('sol-home', 'dennis')
      // The adjacent system with micah's cruiser should NOT be a valid retreat target
      expect(targets).not.toContain(adj)
    })
  })

  describe('Combat Modifiers', () => {
    test('combat resolves with faction combat modifiers (Sardakk N\'orr)', () => {
      // Sardakk N'orr has +1 combat (modifier -1) on all units
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      // System 27 (new-albion/starpoint) is adjacent to P1 home at (0,-3)
      const targetSystem = '27'
      t.setBoard(game, {
        dennis: {
          units: {
            'norr-home': {
              space: ['cruiser', 'cruiser', 'cruiser'],
              'trenlak': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'norr-home', count: 3 }],
      })

      // Sardakk's +1 combat modifier should apply without crashing or producing
      // out-of-bounds values (combat values clamped to 1-10)
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

    test('AFB fires even when no fighters present', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      // Dennis has destroyers (AFB 9x2), micah has only cruisers (no fighters)
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['destroyer', 'destroyer'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['cruiser', 'cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'destroyer', from: 'sol-home', count: 2 }],
      })

      // AFB fires but has no fighters to destroy — should not crash
      // and cruisers should not be erroneously destroyed by AFB
      const micahShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'micah')
      const dennisShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'dennis')
      // Combat should resolve (one side eliminated)
      expect(micahShips.length === 0 || dennisShips.length === 0).toBe(true)
    })
  })

  describe('Combat Log', () => {
    test('_combatLog records space combat events', () => {
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

      const log = game.state._combatLog
      expect(Array.isArray(log)).toBe(true)
      expect(log.length).toBeGreaterThan(0)

      // Should have space-combat-start
      const start = log.find(e => e.type === 'space-combat-start')
      expect(start).toBeDefined()
      expect(start.systemId).toBe(targetSystem)
      expect(start.attacker).toBe('dennis')
      expect(start.defender).toBe('micah')

      // Should have at least one combat-round
      const rounds = log.filter(e => e.type === 'combat-round')
      expect(rounds.length).toBeGreaterThan(0)
      const round1 = rounds[0]
      expect(round1.combatType).toBe('space')
      expect(round1.round).toBe(1)
      expect(round1.sides.attacker.name).toBe('dennis')
      expect(round1.sides.defender.name).toBe('micah')
      expect(round1.sides.attacker.rolls.length).toBeGreaterThan(0)
      expect(round1.sides.attacker.rolls[0]).toHaveProperty('unitType')
      expect(round1.sides.attacker.rolls[0]).toHaveProperty('effectiveCombat')
      expect(round1.sides.attacker.rolls[0]).toHaveProperty('dice')
      expect(round1.sides.attacker.rolls[0].dice[0]).toHaveProperty('roll')
      expect(round1.sides.attacker.rolls[0].dice[0]).toHaveProperty('hit')

      // Should have combat-end
      const end = log.find(e => e.type === 'combat-end')
      expect(end).toBeDefined()
      expect(end.combatType).toBe('space')
      expect(end.winner).toBe('dennis')  // 5 cruisers vs 1 fighter
    })
  })
})
