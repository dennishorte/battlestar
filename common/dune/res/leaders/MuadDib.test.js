const t = require('../../testutil.js')
const leader = require('./MuadDib.js')

describe("Muad'Dib", () => {
  test('data', () => {
    expect(leader.name).toBe("Muad'Dib")
    expect(leader.source).toBe('Uprising')
    expect(leader.leaderAbility).toContain('Unpredictable Foe')
  })

  describe('Unpredictable Foe', () => {
    test('draws an Intrigue at reveal turn when sandworms are in conflict', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { agents: 0 },
        conflict: { deployedSandworms: { dennis: 1 } },
      })
      game.run()
      // Acquire prompt is now waiting; intrigue zone is set. Compare against
      // baseline (no leader, same setup).
      const baseline = t.fixture()
      t.setBoard(baseline, { dennis: { agents: 0 } })
      baseline.run()
      const intrigueBefore = baseline.zones.byId('dennis.intrigue').cardlist().length
      expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(intrigueBefore + 1)
    })

    test('draws exactly one Intrigue regardless of sandworm count', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { agents: 0 },
        conflict: { deployedSandworms: { dennis: 3 } },
      })
      game.run()
      // Acquire prompt is now waiting; intrigue zone is set. Compare against
      // baseline (no leader, same setup).
      const baseline = t.fixture()
      t.setBoard(baseline, { dennis: { agents: 0 } })
      baseline.run()
      const intrigueBefore = baseline.zones.byId('dennis.intrigue').cardlist().length
      expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(intrigueBefore + 1)
    })

    test('does nothing when no sandworms in conflict', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { agents: 0 },
      })
      game.run()
      // Acquire prompt is now waiting; intrigue zone is set. Compare against
      // baseline (no leader, same setup).
      const baseline = t.fixture()
      t.setBoard(baseline, { dennis: { agents: 0 } })
      baseline.run()
      const intrigueBefore = baseline.zones.byId('dennis.intrigue').cardlist().length
      expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(intrigueBefore)
    })
  })

  describe('Lead the Way', () => {
    test('+1 Draw via signet ring agent turn', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { hand: ['Signet Ring'] },
      })
      game.run()

      const handBefore = game.zones.byId('dennis.hand').cardlist().length

      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Arrakeen')
      t.choose(game, 'Signet Ring')

      // -1 Signet Ring played, +1 from Lead the Way, +1 from Arrakeen = net +1
      expect(game.zones.byId('dennis.hand').cardlist().length).toBe(handBefore + 1)
    })
  })
})
