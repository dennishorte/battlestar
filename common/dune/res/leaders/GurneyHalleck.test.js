const t = require('../../testutil.js')
const leader = require('./GurneyHalleck.js')

describe('Gurney Halleck', () => {
  test('data', () => {
    expect(leader.name).toBe('Gurney Halleck')
    expect(leader.leaderAbility).toContain('Always Smiling')
  })

  test('assigns in-game', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()
    expect(game.state.leaders.dennis.name).toBe('Gurney Halleck')
  })
})
