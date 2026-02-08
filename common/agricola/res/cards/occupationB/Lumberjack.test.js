const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Lumberjack (B119)', () => {
  test('schedules wood on next rounds based on fence count', () => {
    const card = res.getCardById('lumberjack-b119')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)
    dennis.getFenceCount = jest.fn().mockReturnValue(3)

    card.onPlay(game, dennis)

    expect(game.state.scheduledWood.dennis[6]).toBe(1)
    expect(game.state.scheduledWood.dennis[7]).toBe(1)
    expect(game.state.scheduledWood.dennis[8]).toBe(1)
  })

  test('does not schedule beyond round 14', () => {
    const card = res.getCardById('lumberjack-b119')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 12

    const dennis = t.player(game)
    dennis.getFenceCount = jest.fn().mockReturnValue(5)

    card.onPlay(game, dennis)

    expect(game.state.scheduledWood.dennis[13]).toBe(1)
    expect(game.state.scheduledWood.dennis[14]).toBe(1)
    expect(game.state.scheduledWood.dennis[15]).toBeUndefined()
  })

  test('does not schedule anything when no fences', () => {
    const card = res.getCardById('lumberjack-b119')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)
    dennis.getFenceCount = jest.fn().mockReturnValue(0)

    card.onPlay(game, dennis)

    expect(game.state.scheduledWood).toBeUndefined()
  })
})
