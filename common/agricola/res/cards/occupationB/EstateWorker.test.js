const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Estate Worker (B125)', () => {
  test('schedules building resources on next 4 rounds', () => {
    const card = res.getCardById('estate-worker-b125')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 3

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.scheduledWood.dennis[4]).toBe(1)
    expect(game.state.scheduledClay.dennis[5]).toBe(1)
    expect(game.state.scheduledReed.dennis[6]).toBe(1)
    expect(game.state.scheduledStone.dennis[7]).toBe(1)
  })

  test('does not schedule resources beyond round 14', () => {
    const card = res.getCardById('estate-worker-b125')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 12

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.scheduledWood.dennis[13]).toBe(1)
    expect(game.state.scheduledClay.dennis[14]).toBe(1)
    expect(game.state.scheduledReed).toBeUndefined()
    expect(game.state.scheduledStone).toBeUndefined()
  })
})
