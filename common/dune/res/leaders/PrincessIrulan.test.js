const t = require('../../testutil.js')
const leader = require('./PrincessIrulan.js')

describe('Princess Irulan', () => {
  test('data', () => {
    expect(leader.name).toBe('Princess Irulan')
    expect(leader.leaderAbility).toContain('Imperial Birthright')
  })

  test('Imperial Birthright awards Intrigue once at 2 emperor influence', () => {
    const game = t.fixture()
    t.setBoard(game, {
      leaders: { dennis: leader },
      dennis: { influence: { emperor: 1 } },
    })
    game.run()

    const factions = require('../../systems/factions.js')
    const dennis = game.players.byName('dennis')
    const startCount = game.zones.byId('dennis.intrigue').cardlist().length
    factions.gainInfluence(game, dennis, 'emperor')
    const afterFirst = game.zones.byId('dennis.intrigue').cardlist().length
    expect(afterFirst).toBe(startCount + 1)

    // Second time at 2+: no additional trigger
    factions.gainInfluence(game, game.players.byName('dennis'), 'emperor')
    const afterSecond = game.zones.byId('dennis.intrigue').cardlist().length
    expect(afterSecond).toBe(afterFirst)
  })
})
