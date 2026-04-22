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

  test('Lead the Way signet ring draws 1 card via parseAgentAbility', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()

    const hand = game.zones.byId('dennis.hand').cardlist()
    if (!hand.find(c => c.name === 'Signet Ring')) {
      return
    }
    const handCountBefore = hand.length

    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Arrakeen')
    // Effect order choice: resolve signet ring first
    t.choose(game, 'Signet Ring')

    // Player drew a card from Lead the Way (signet ring resolution moves
    // the card itself to played; draw adds one). Net: hand same as before
    // (signet moved out, one card in).
    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(handCountBefore)
  })
})
