const t = require('../../testutil.js')
const leader = require('./GurneyHalleck.js')

describe('Gurney Halleck', () => {
  test('data', () => {
    expect(leader.name).toBe('Gurney Halleck')
    expect(leader.leaderAbility).toContain('Always Smiling')
  })

  describe('Always Smiling', () => {
    test('+1 Persuasion when 3 troops deployed (6 strength)', () => {
      // 0 agents → straight to reveal turn. With 3 troops deployed, strength
      // hits 6 and Always Smiling grants +1 Persuasion before acquire.
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { agents: 0 },
        conflict: { deployedTroops: { dennis: 3 } },
      })
      game.run()

      // Acquire prompt shows total persuasion. Starter hand reveals 5
      // persuasion. Always Smiling adds +1 → 6 available.
      expect(game.waiting.selectors[0].title).toContain('6 Persuasion available')
    })

    test('+1 Persuasion when 2 troops + 1 sandworm (7 strength)', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { agents: 0 },
        conflict: {
          deployedTroops: { dennis: 2 },
          deployedSandworms: { dennis: 1 },
        },
      })
      game.run()

      expect(game.waiting.selectors[0].title).toContain('6 Persuasion available')
    })

    test('no bonus at 2 troops only (4 strength + 1 dagger sword = 5)', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { agents: 0 },
        conflict: { deployedTroops: { dennis: 2 } },
      })
      game.run()

      // Starter hand persuasion = 5, no bonus → still 5
      expect(game.waiting.selectors[0].title).toContain('5 Persuasion available')
    })

    test('no bonus with zero deployed units (no strength in Conflict)', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { agents: 0 },
      })
      game.run()

      expect(game.waiting.selectors[0].title).toContain('5 Persuasion available')
    })
  })

  describe('Warmaster', () => {
    test('signet ring gives +1 Troop (from supply to garrison)', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { hand: ['Signet Ring'] },
      })
      game.run()

      const garrisonBefore = game.players.byName('dennis').troopsInGarrison
      const supplyBefore = game.players.byName('dennis').troopsInSupply

      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Arrakeen')
      t.choose(game, 'Signet Ring')

      // Signet Ring (+1 troop) + Arrakeen (+1 troop) = +2 garrison
      const dennis = game.players.byName('dennis')
      expect(dennis.troopsInGarrison).toBe(garrisonBefore + 2)
      expect(dennis.troopsInSupply).toBe(supplyBefore - 2)
    })
  })
})
