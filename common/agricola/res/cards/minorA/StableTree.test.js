const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Stable Tree', () => {
  test('schedules wood on next 3 round spaces on stable build', () => {
    const card = res.getCardById('stable-tree-a074')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['stable-tree-a074'],
      },
      round: 5,
    })
    game.run()

    const dennis = t.dennis(game)
    game.state.round = 5
    card.onBuildStable(game, dennis)

    expect(game.state.scheduledWood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][8]).toBe(1)
  })

  test('does not schedule wood past round 14', () => {
    const card = res.getCardById('stable-tree-a074')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['stable-tree-a074'],
      },
      round: 13,
    })
    game.run()

    const dennis = t.dennis(game)
    game.state.round = 13
    card.onBuildStable(game, dennis)

    expect(game.state.scheduledWood[dennis.name][14]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][15]).toBeUndefined()
    expect(game.state.scheduledWood[dennis.name][16]).toBeUndefined()
  })
})
