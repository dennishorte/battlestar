const t = require('../../testutil.js')
const leader = require('./PrincessYunaMoritani.js')

describe('Princess Yuna Moritani', () => {
  test('data', () => {
    expect(leader.name).toBe('Princess Yuna Moritani')
  })

  test('Smuggling Operation starts with no water', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()
    const dennis = game.players.byName('dennis')
    expect(dennis.water).toBe(0)
  })
})
