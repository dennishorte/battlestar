const t = require('../testutil')
const leaders = require('../systems/leaders')

describe('Leaders', () => {

  test('every player gets a leader assigned by default', () => {
    const game = t.fixture()
    game.run()

    for (const player of game.players.all()) {
      const leader = leaders.getLeader(game, player)
      expect(leader).toBeTruthy()
      expect(leader.name).toBeTruthy()
    }

    // Different leaders for each player
    const names = game.players.all().map(p => leaders.getLeader(game, p).name)
    expect(new Set(names).size).toBe(names.length)
  })

  test('Glossu Rabban starting effect gives +1 spice and +1 solari', () => {
    const game = t.fixture()
    const leaderData = require('../res/leaders/index.js')
    const rabban = leaderData.find(l => l.name.includes('Beast'))

    t.setBoard(game, {
      leaders: {
        dennis: rabban,
      },
    })
    game.run()

    const leader = leaders.getLeader(game, game.players.byName('dennis'))
    expect(leader.name).toContain('Beast')

    const player = game.players.byName('dennis')
    // Rabban gives +1 spice and +1 solari at game start
    expect(player.spice).toBe(1)
    expect(player.solari).toBe(1)
  })
})
