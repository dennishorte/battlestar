const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Large Greenhouse', () => {
  test('schedules vegetables for rounds current+4, +7, +9', () => {
    const card = res.getCardById('large-greenhouse-a069')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['large-greenhouse-a069'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
      round: 3,
    })
    game.run()

    const dennis = t.dennis(game)
    game.state.round = 3
    card.onPlay(game, dennis)

    // Should schedule vegetables for rounds 7, 10, 12
    expect(game.state.scheduledVegetables[dennis.name][7]).toBe(1)
    expect(game.state.scheduledVegetables[dennis.name][10]).toBe(1)
    expect(game.state.scheduledVegetables[dennis.name][12]).toBe(1)
  })
})
