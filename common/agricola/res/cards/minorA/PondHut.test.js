const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Pond Hut', () => {
  test('schedules 1 food for next 3 rounds', () => {
    const card = res.getCardById('pond-hut-a044')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['pond-hut-a044'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
      round: 5,
    })
    game.run()

    const dennis = t.dennis(game)
    game.state.round = 5
    card.onPlay(game, dennis)

    // Should schedule food for rounds 6, 7, 8
    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
  })
})
