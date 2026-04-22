const t = require('../../testutil.js')
const leader = require('./MuadDib.js')

describe("Muad'Dib", () => {
  test('data', () => {
    expect(leader.name).toBe("Muad'Dib")
    expect(leader.source).toBe('Uprising')
    expect(leader.leaderAbility).toContain('Unpredictable Foe')
  })

  test('onRevealTurn draws an intrigue when sandworms are in conflict', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()

    const dennis = game.players.byName('dennis')
    game.state.conflict.deployedSandworms[dennis.name] = 1
    const before = game.zones.byId('dennis.intrigue').cardlist().length
    leader.onRevealTurn(game, dennis)
    const after = game.zones.byId('dennis.intrigue').cardlist().length
    expect(after).toBe(before + 1)
  })

  test('onRevealTurn does nothing without sandworms', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()

    const dennis = game.players.byName('dennis')
    const before = game.zones.byId('dennis.intrigue').cardlist().length
    leader.onRevealTurn(game, dennis)
    const after = game.zones.byId('dennis.intrigue').cardlist().length
    expect(after).toBe(before)
  })
})
