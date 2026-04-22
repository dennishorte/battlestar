const t = require('../../testutil.js')
const leader = require('./LadyAmberMetulli.js')

describe('Lady Amber Metulli', () => {
  test('data', () => {
    expect(leader.name).toBe('Lady Amber Metulli')
    expect(leader.leaderAbility).toContain('Desert Scouts')
  })

  test('Fill Coffers gives +1 Solari (no alliance)', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader }, dennis: { solari: 0, spice: 0 } })
    game.run()

    const dennis = game.players.byName('dennis')
    leader.resolveSignetRing(game, dennis)
    expect(game.players.byName('dennis').solari).toBe(1)
    expect(game.players.byName('dennis').spice).toBe(0)
  })

  test('Fill Coffers gives +1 Spice with an alliance', () => {
    const game = t.fixture()
    t.setBoard(game, {
      leaders: { dennis: leader },
      dennis: { solari: 0, spice: 0 },
      alliances: { emperor: 'dennis' },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    leader.resolveSignetRing(game, dennis)
    expect(game.players.byName('dennis').solari).toBe(1)
    expect(game.players.byName('dennis').spice).toBe(1)
  })
})
