const t = require('../../testutil.js')
const leader = require('./FeydRauthaHarkonnen.js')

describe('Feyd-Rautha Harkonnen', () => {
  test('data', () => {
    expect(leader.name).toBe('Feyd-Rautha Harkonnen')
  })

  test('onAssign initializes feydTrack at start', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()
    expect(game.state.feydTrack.dennis).toBe('start')
  })
})
