const t = require('../../../testutil.js')

describe('Young Animal Market (A009)', () => {
  test('exchanges sheep for cattle', () => {
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        hand: ['young-animal-market-a009'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }], animals: { sheep: 2 } }],
        },
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'young-animal-market-a009')

    const dennis = t.player(game)
    expect(dennis.getTotalAnimals('sheep')).toBe(1) // 2 - 1 cost
    expect(dennis.getTotalAnimals('cattle')).toBe(1) // +1 from card
  })
})
