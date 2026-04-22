const t = require('../../testutil.js')
const leader = require('./BaronVladimirHarkonnen.js')

describe('Baron Vladimir Harkonnen', () => {
  test('data', () => {
    expect(leader.name).toBe('Baron Vladimir Harkonnen')
    expect(leader.leaderAbility).toContain('Masterstroke')
  })

  test('assigns in-game', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()
    expect(game.state.leaders.dennis.name).toBe('Baron Vladimir Harkonnen')
  })
})
