const t = require('../../../testutil_v2.js')

describe('Muck Rake', () => {
  test('1 bonus point per animal type in exactly 1 unfenced stable', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['muck-rake-d029'],
        farmyard: {
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        },
        animals: { sheep: 1, boar: 1, cattle: 1 },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const card = dennis.cards.byId('muck-rake-d029')
    // 1 sheep in 1 stable, 1 boar in 1 stable, 1 cattle in 1 stable = 3 points
    expect(card.callHook('getEndGamePoints', dennis)).toBe(3)
  })

  test('no points if 2 stables hold same animal type', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['muck-rake-d029'],
        farmyard: {
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        },
        animals: { sheep: 2, cattle: 1 },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const card = dennis.cards.byId('muck-rake-d029')
    // 2 stables with sheep (not exactly 1) → 0 for sheep, 1 for cattle = 1
    expect(card.callHook('getEndGamePoints', dennis)).toBe(1)
  })
})
