const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Tree Farm Joiner (B096)', () => {
  test('schedules wood on next 2 odd-numbered rounds', () => {
    const card = res.getCardById('tree-farm-joiner-b096')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 2

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.scheduledWoodWithMinor.dennis).toContain(3)
    expect(game.state.scheduledWoodWithMinor.dennis).toContain(5)
    expect(game.state.scheduledWoodWithMinor.dennis).not.toContain(4)
  })

  test('schedules on next odd rounds starting from even round', () => {
    const card = res.getCardById('tree-farm-joiner-b096')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 4

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.scheduledWoodWithMinor.dennis).toContain(5)
    expect(game.state.scheduledWoodWithMinor.dennis).toContain(7)
  })

  test('schedules on next odd rounds starting from odd round', () => {
    const card = res.getCardById('tree-farm-joiner-b096')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 7

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.scheduledWoodWithMinor.dennis).toContain(9)
    expect(game.state.scheduledWoodWithMinor.dennis).toContain(11)
  })

  test('does not schedule beyond round 14', () => {
    const card = res.getCardById('tree-farm-joiner-b096')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 12

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.scheduledWoodWithMinor.dennis).toContain(13)
    expect(game.state.scheduledWoodWithMinor.dennis.length).toBe(1)
  })
})
