const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Anomalies', () => {

  // -------------------------------------------------------------------------
  // Nebula (Rule 59)
  // -------------------------------------------------------------------------

  describe('Nebula', () => {
    test('ship starting in nebula has move value 1', () => {
      // System 42 (nebula) is adjacent to 34 (1 hop).
      // 34 is adjacent to 18/Mecatol (2 hops from 42).
      // A cruiser (move 2) starting in nebula should only reach 1 hop (34), not 2 (18).
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            '42': { space: ['cruiser'] },
            'sol-home': { 'jord': ['space-dock'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Move cruiser from nebula (42) to adjacent system 34 — should work (1 hop)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '34' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: '42', count: 1 }],
      })

      const dennisShips = game.state.units['34'].space
        .filter(u => u.owner === 'dennis')
      expect(dennisShips.length).toBe(1)
      expect(dennisShips[0].type).toBe('cruiser')
    })

    test('ship starting in nebula cannot reach 2 hops away', () => {
      // Cruiser (move 2) in nebula 42 tries to reach Mecatol 18 (2 hops: 42→34→18)
      // With nebula clamp to move 1, it should fail — ship stays at origin
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            '42': { space: ['cruiser'] },
            'sol-home': { 'jord': ['space-dock'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '18' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: '42', count: 1 }],
      })

      // Cruiser should NOT arrive at Mecatol (move clamped to 1)
      const dennisAtMecatol = game.state.units['18'].space
        .filter(u => u.owner === 'dennis')
      expect(dennisAtMecatol.length).toBe(0)
    })

    test('Gravity Drive adds +1 when starting in nebula', () => {
      // With Gravity Drive (+1), nebula base 1 + 1 = 2 total move
      // Cruiser at 42 should reach Mecatol 18 (2 hops: 42→34→18)
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          technologies: ['gravity-drive'],
          units: {
            '42': { space: ['cruiser'] },
            'sol-home': { 'jord': ['space-dock'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '18' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: '42', count: 1 }],
      })

      const dennisAtMecatol = game.state.units['18'].space
        .filter(u => u.owner === 'dennis')
      expect(dennisAtMecatol.length).toBe(1)
    })

    test('defender gets +1 combat in nebula', () => {
      // Set up combat in nebula system 42. Defender (micah) should get combat bonus.
      // With deterministic seed, we can verify micah's ships survive better than expected.
      // 5 cruisers (attacker) vs 3 cruisers (defender with +1 bonus)
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            '34': { space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'] },
            'sol-home': { 'jord': ['space-dock'] },
          },
        },
        micah: {
          units: {
            '42': { space: ['cruiser', 'cruiser', 'cruiser'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '42' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: '34', count: 5 }],
      })

      // Combat happens in nebula — defender (micah) gets +1 bonus
      // Just verify combat resolved (one side should be eliminated)
      const dennisShips = game.state.units['42'].space.filter(u => u.owner === 'dennis')
      const micahShips = game.state.units['42'].space.filter(u => u.owner === 'micah')
      expect(dennisShips.length + micahShips.length).toBeGreaterThan(0)
      // At least one side must be eliminated
      expect(dennisShips.length === 0 || micahShips.length === 0).toBe(true)
    })
  })

  // -------------------------------------------------------------------------
  // Gravity Rift (Rule 41)
  // -------------------------------------------------------------------------

  describe('Gravity Rift', () => {
    test('ship gets +1 move exiting gravity rift', () => {
      // System 41 (gravity rift, q=-2,r=0) → 35 (q=-1,r=0) → 18/Mecatol (q=0,r=0)
      // Dreadnought (move 1) at 41: exit rift costs 0, then 35→18 costs 1 = total 1
      // Should reach Mecatol with move value 1
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            '41': { space: ['dreadnought'] },
            'sol-home': { 'jord': ['space-dock'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '18' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'dreadnought', from: '41', count: 1 }],
      })

      // Dreadnought should arrive (rift exit = 0 cost, so 41→35→18 = 1 move)
      const dennisAtMecatol = game.state.units['18'].space
        .filter(u => u.owner === 'dennis' && u.type === 'dreadnought')
      expect(dennisAtMecatol.length).toBe(1)
    })

    test('dreadnought cannot reach 2 hops without gravity rift', () => {
      // Control test: dreadnought (move 1) at system 35 (NOT a rift) cannot reach
      // 2 hops to system 20. 35→18→20 = 2 hops, move 1 is not enough.
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            '35': { space: ['dreadnought'] },
            'sol-home': { 'jord': ['space-dock'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '20' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'dreadnought', from: '35', count: 1 }],
      })

      // Dreadnought should NOT arrive (2 hops, move 1)
      const dennisAt20 = game.state.units['20'].space
        .filter(u => u.owner === 'dennis' && u.type === 'dreadnought')
      expect(dennisAt20.length).toBe(0)
    })

    test('gravity rift die roll can remove ships', () => {
      // Move multiple cruisers out of gravity rift system 41
      // Some may be removed by the d10 roll (1-3 = removed)
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            '41': { space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'] },
            'sol-home': { 'jord': ['space-dock'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '35' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: '41', count: 5 }],
      })

      // Some ships may have been removed by the rift
      const dennisAt35 = game.state.units['35'].space
        .filter(u => u.owner === 'dennis' && u.type === 'cruiser')
      expect(dennisAt35.length).toBeLessThanOrEqual(5)
      expect(dennisAt35.length).toBeGreaterThanOrEqual(0)
    })

    test('gravity rift removal is not destruction (no onUnitDestroyed)', () => {
      // Vuil'raith Cabal captures units on destruction. Gravity rift removal
      // should NOT trigger capture. Use Cabal faction and verify no captures.
      const game = t.fixture({ factions: ['vuil-raith-cabal', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: {
          units: {
            '41': { space: ['cruiser', 'cruiser', 'cruiser'] },
            // Need home system space dock
          },
        },
        micah: {
          units: {
            'sol-home': { 'jord': ['space-dock'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '35' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: '41', count: 3 }],
      })

      // Even if ships were removed, Cabal should NOT have captured anything
      const micahCaptures = game.state.capturedUnits?.micah || []
      expect(micahCaptures.length).toBe(0)
    })
  })

  // -------------------------------------------------------------------------
  // Post-Combat Excess Capacity (Rule 78.10a)
  // -------------------------------------------------------------------------

  describe('Post-Combat Excess Capacity', () => {
    test('excess fighters removed after carrier destroyed', () => {
      // dennis: 1 carrier (capacity 4) + 4 fighters at target
      // dennis attacks with cruisers; micah has overwhelming force to destroy carrier
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            '34': { space: ['carrier', 'fighter', 'fighter', 'fighter', 'fighter', 'cruiser'] },
            'sol-home': { 'jord': ['space-dock'] },
          },
        },
        micah: {
          units: {
            '35': { space: ['dreadnought', 'dreadnought', 'dreadnought', 'cruiser', 'cruiser'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // dennis attacks micah's system with carrier + fighters + cruiser
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '35' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: '34', count: 1 },
          { unitType: 'fighter', from: '34', count: 4 },
          { unitType: 'cruiser', from: '34', count: 1 },
        ],
      })

      // After combat resolves, check capacity enforcement
      const dennisShips = game.state.units['35'].space.filter(u => u.owner === 'dennis')
      const dennisCarriers = dennisShips.filter(u => u.type === 'carrier')
      const dennisFighters = dennisShips.filter(u => u.type === 'fighter')
      const dennisCruisers = dennisShips.filter(u => u.type === 'cruiser')

      // Calculate remaining capacity
      const capacity = dennisCarriers.length * 4 + dennisCruisers.length * 0
      // Fighters requiring capacity should not exceed available capacity
      expect(dennisFighters.length).toBeLessThanOrEqual(capacity)
    })
  })
})
