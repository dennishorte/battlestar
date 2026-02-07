const t = require('../../../testutil.js')

describe('Stone Cart (C079)', () => {
  test('schedules stone for even-numbered rounds', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        wood: 2,
        hand: ['stone-cart-c079'],
        occupations: ['wood-cutter', 'firewood-collector'],
      },
      round: 5,
    })
    game.run()

    game.state.round = 5
    t.playCard(game, 'dennis', 'stone-cart-c079')

    const dennis = t.player(game)
    // Even rounds after 5: 6, 8, 10, 12, 14
    expect(game.state.scheduledStone[dennis.name][6]).toBe(1)
    expect(game.state.scheduledStone[dennis.name][8]).toBe(1)
    expect(game.state.scheduledStone[dennis.name][10]).toBe(1)
    expect(game.state.scheduledStone[dennis.name][12]).toBe(1)
    expect(game.state.scheduledStone[dennis.name][14]).toBe(1)
  })
})
