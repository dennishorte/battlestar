const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Garden Claw (C047)', () => {
  test('schedules food based on planted fields', () => {
    const card = res.getCardById('garden-claw-c047')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPlantedFields = () => [{ crop: 'grain' }, { crop: 'vegetables' }]
    game.state.round = 10

    card.onPlay(game, dennis)

    // 2 planted fields * 3 = 6, but only 4 rounds left (11, 12, 13, 14)
    expect(game.state.scheduledFood[dennis.name][11]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][12]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][13]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][14]).toBe(1)
  })
})
