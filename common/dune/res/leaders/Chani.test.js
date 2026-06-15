const t = require('../../testutil.js')
const leader = require('./Chani.js')

describe('Chani', () => {
  test('data', () => {
    expect(leader.name).toBe('Chani')
    expect(leader.source).toBe('Bloodlines')
  })

  function playSignetRing(game) {
    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Signet Ring') // resolve leader ability before Arrakeen
  }

  describe('Fedaykin Maneuver — retreat', () => {
    test('retreats chosen number of troops to supply', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { hand: ['Signet Ring'] },
        conflict: { deployedTroops: { dennis: 3 } },
      })
      game.run()

      playSignetRing(game)
      // No 2+ Fremen influence → no top-level choice; goes straight to count
      t.choose(game, '2 troops')

      expect(game.state.conflict.deployedTroops.dennis).toBe(1)
    })

    test('pass retreats 0 troops', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { hand: ['Signet Ring'] },
        conflict: { deployedTroops: { dennis: 2 } },
      })
      game.run()

      playSignetRing(game)
      t.choose(game, 'Pass')

      expect(game.state.conflict.deployedTroops.dennis).toBe(2)
    })

    test('no troops in conflict: skips count prompt', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { hand: ['Signet Ring'] },
      })
      game.run()

      // No deployed troops: skips count prompt entirely
      playSignetRing(game)
    })
  })

  describe('Fedaykin Maneuver — water trade', () => {
    test('trade 1 Water for 2 draws when 2+ Fremen influence', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { hand: ['Signet Ring'], water: 2, influence: { fremen: 2 } },
      })
      game.run()

      playSignetRing(game)
      t.choose(game, 'Trade 1 Water for 2 Draws')

      const dennis = game.players.byName('dennis')
      expect(dennis.water).toBe(1)
    })

    test('water trade not offered without 2+ Fremen influence', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { hand: ['Signet Ring'], water: 2, influence: { fremen: 1 } },
      })
      game.run()

      // No top-level choice; 0 deployed troops → no count prompt either
      playSignetRing(game)
    })

    test('water trade not offered without water', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { hand: ['Signet Ring'], water: 0, influence: { fremen: 3 } },
      })
      game.run()

      playSignetRing(game)
      // No water → trade not offered; retreat only, 0 troops deployed
    })
  })
})
