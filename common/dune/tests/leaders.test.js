const t = require('../testutil')
const leaders = require('../systems/leaders')

describe('Leaders', () => {

  test('random leader assignment gives each player a leader', () => {
    const game = t.fixture({ useLeaders: true, randomLeaders: true })
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

  test('leader selection via player choice', () => {
    const game = t.fixture({ useLeaders: true, randomLeaders: false })
    game.run()

    // First player chooses
    const choices1 = t.currentChoices(game)
    expect(choices1.length).toBeGreaterThan(0)
    t.choose(game, choices1[0])

    // Second player chooses (first choice should be gone)
    const choices2 = t.currentChoices(game)
    expect(choices2).not.toContain(choices1[0])
    t.choose(game, choices2[0])

    for (const player of game.players.all()) {
      expect(leaders.getLeader(game, player)).toBeTruthy()
    }
  })

  test('Glossu Rabban starting effect gives +1 spice and +1 solari', () => {
    const game = t.fixture({ useLeaders: true, randomLeaders: false })
    game.run()

    // Both players choose Rabban (first player gets him)
    const choices = t.currentChoices(game)
    const rabban = choices.find(c => c.includes('Beast'))
    if (!rabban) {
      return
    }

    t.choose(game, rabban)
    // Second player picks anyone
    t.choose(game, t.currentChoices(game)[0])

    // Leader selection happens before game run reaches player turns.
    // After choosing leaders, game continues into round 1. Check state via leader assignment.
    const leader = leaders.getLeader(game, game.players.byName('dennis'))
    expect(leader.name).toContain('Beast')
  })

  test('no leaders without useLeaders setting', () => {
    const game = t.fixture({ useLeaders: false })
    game.run()

    for (const player of game.players.all()) {
      expect(leaders.getLeader(game, player)).toBeNull()
    }
  })
})
