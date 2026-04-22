const t = require('../../testutil.js')
const leader = require('./DukeLetoAtreides.js')

describe('Duke Leto Atreides', () => {
  test('data', () => {
    expect(leader.name).toBe('Duke Leto Atreides')
    expect(leader.source).toBe('Base')
    expect(leader.house).toBe('Atreides')
  })

  test('Landsraad Popularity: green space cost -1 Solari', () => {
    const baseCost = { solari: 3 }
    const space = { icon: 'green' }
    const cost = leader.modifySpaceCost({}, {}, space, baseCost)
    expect(cost.solari).toBe(2)
  })

  test('Landsraad Popularity: does not go below 0', () => {
    const cost = leader.modifySpaceCost({}, {}, { icon: 'green' }, { solari: 0 })
    expect(cost.solari).toBe(0)
  })

  test('Landsraad Popularity: non-green spaces unaffected', () => {
    const cost = leader.modifySpaceCost({}, {}, { icon: 'yellow' }, { solari: 3 })
    expect(cost.solari).toBe(3)
  })

  test('assigns to a player in-game', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()
    expect(game.state.leaders.dennis.name).toBe('Duke Leto Atreides')
  })
})
