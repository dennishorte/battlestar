const t = require('../../testutil.js')
const leader = require('./GurneyHalleck.js')

describe('Gurney Halleck', () => {
  test('data', () => {
    expect(leader.name).toBe('Gurney Halleck')
    expect(leader.leaderAbility).toContain('Always Smiling')
  })

  test('Always Smiling grants +1 Persuasion at 6+ strength on reveal', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.setCounter('strength', 6, { silent: true })
    const before = dennis.getCounter('persuasion')
    leader.onRevealTurn(game, dennis)
    expect(game.players.byName('dennis').getCounter('persuasion')).toBe(before + 1)
  })

  test('Always Smiling does nothing below threshold', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.setCounter('strength', 5, { silent: true })
    const before = dennis.getCounter('persuasion')
    leader.onRevealTurn(game, dennis)
    expect(game.players.byName('dennis').getCounter('persuasion')).toBe(before)
  })
})
