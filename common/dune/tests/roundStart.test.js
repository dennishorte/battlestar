const t = require('../testutil')

describe('Round Start', () => {

  test('conflict card revealed each round', () => {
    const game = t.fixture()
    game.run()

    // Round 1: 1 card revealed, 9 remaining
    expect(game.zones.byId('common.conflictActive').cardlist().length).toBe(1)
    expect(game.zones.byId('common.conflictDeck').cardlist().length).toBe(9)

    // Both reveal + pass to complete round 1
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Round 2: 2 cards stacked in active, 8 remaining
    expect(game.state.round).toBe(2)
    expect(game.zones.byId('common.conflictActive').cardlist().length).toBe(2)
    expect(game.zones.byId('common.conflictDeck').cardlist().length).toBe(8)
  })

  test('each player draws 5 cards at round start', () => {
    const game = t.fixture()
    game.run()

    // After round 1 start, both players have 5 cards
    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(5)
    expect(game.zones.byId('micah.hand').cardlist().length).toBe(5)
  })
})
