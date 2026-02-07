const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stable Tree (A074)', () => {
  test('schedules wood on next 3 round spaces on stable build', () => {
    const card = res.getCardById('stable-tree-a074')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onBuildStable(game, dennis)

    expect(game.state.scheduledWood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][8]).toBe(1)
  })

  test('does not schedule wood past round 14', () => {
    const card = res.getCardById('stable-tree-a074')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 13

    card.onBuildStable(game, dennis)

    expect(game.state.scheduledWood[dennis.name][14]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][15]).toBeUndefined()
    expect(game.state.scheduledWood[dennis.name][16]).toBeUndefined()
  })
})
