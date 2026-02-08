const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Scrap Collector (E120)', () => {
  test('schedules alternating wood and clay for next 6 rounds', () => {
    const card = res.getCardById('scrap-collector-e120')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 3

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.scheduledWood.dennis[4]).toBe(1)
    expect(game.state.scheduledClay.dennis[5]).toBe(1)
    expect(game.state.scheduledWood.dennis[6]).toBe(1)
    expect(game.state.scheduledClay.dennis[7]).toBe(1)
    expect(game.state.scheduledWood.dennis[8]).toBe(1)
    expect(game.state.scheduledClay.dennis[9]).toBe(1)
  })

  test('does not schedule resources beyond round 14', () => {
    const card = res.getCardById('scrap-collector-e120')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 12

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.scheduledWood.dennis[13]).toBe(1)
    expect(game.state.scheduledClay.dennis[14]).toBe(1)
    expect(game.state.scheduledWood.dennis[15]).toBeUndefined()
  })
})
