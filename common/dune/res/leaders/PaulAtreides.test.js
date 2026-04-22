const t = require('../../testutil.js')
const leader = require('./PaulAtreides.js')

describe('Paul Atreides', () => {
  test('data', () => {
    expect(leader.name).toBe('Paul Atreides')
    expect(leader.leaderAbility).toContain('Prescience')
    expect(leader.signetRingAbility).toContain('Discipline')
  })

  test('Prescience logs the top card of the deck on agent turn', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()

    t.choose(game, 'Agent Turn.Dagger')

    const logText = JSON.stringify(game.log._log)
    expect(logText).toMatch(/Prescience/)
  })
})
