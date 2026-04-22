const t = require('../../testutil.js')
const leader = require('./HelenaRichese.js')

describe('Helena Richese', () => {
  test('data', () => {
    expect(leader.name).toBe('Helena Richese')
    expect(leader.leaderAbility).toContain('Eyes Everywhere')
  })

  test('ignoresOccupancy on green and purple spaces only', () => {
    expect(leader.ignoresOccupancy({}, {}, { icon: 'green' })).toBe(true)
    expect(leader.ignoresOccupancy({}, {}, { icon: 'purple' })).toBe(true)
    expect(leader.ignoresOccupancy({}, {}, { icon: 'yellow' })).toBe(false)
    expect(leader.ignoresOccupancy({}, {}, { icon: 'emperor' })).toBe(false)
  })

  test('Manipulate Signet Ring reserves an Imperium Row card', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()

    const hand = game.zones.byId('dennis.hand').cardlist()
    if (!hand.find(c => c.name === 'Signet Ring')) {
      return
    }

    const rowBefore = game.zones.byId('common.imperiumRow').cardlist().map(c => c.name)
    const targetName = rowBefore[0]

    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Signet Ring')
    t.choose(game, targetName)

    const reserved = game.zones.byId('common.helenaReserved').cardlist()
    expect(reserved).toHaveLength(1)
    expect(reserved[0].name).toBe(targetName)
  })
})
