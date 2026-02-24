const t = require('../testutil.js')

describe('stables', () => {
  test('buildStable creates stable', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.buildStable(2, 0)).toBe(true)

    expect(dennis.getSpace(2, 0).hasStable).toBe(true)
    expect(dennis.getStableCount()).toBe(1)
  })

  test('cannot build stable on room or field', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.plowField(2, 0)

    expect(dennis.canBuildStable(0, 0)).toBe(false) // Room
    expect(dennis.canBuildStable(2, 0)).toBe(false) // Field
  })

  test('max 4 stables per player', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    t.buildStables(dennis, [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
    ])

    expect(dennis.canBuildStable(1, 4)).toBe(false)
  })
})
