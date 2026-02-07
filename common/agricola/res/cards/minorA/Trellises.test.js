const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Trellises (A047)', () => {
  test('schedules food based on built fences', () => {
    const card = res.getCardById('trellises-a047')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getBuiltFenceCount = () => 4
    game.state.round = 5

    card.onPlay(game, dennis)

    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][9]).toBe(1)
  })

  test('does not schedule past round 14', () => {
    const card = res.getCardById('trellises-a047')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getBuiltFenceCount = () => 10
    game.state.round = 12

    card.onPlay(game, dennis)

    expect(game.state.scheduledFood[dennis.name][13]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][14]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][15]).toBeUndefined()
  })

  test('does nothing with no fences', () => {
    const card = res.getCardById('trellises-a047')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getBuiltFenceCount = () => 0
    game.state.round = 5

    card.onPlay(game, dennis)

    expect(game.state.scheduledFood).toBeUndefined()
  })
})
