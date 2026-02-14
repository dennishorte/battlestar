const t = require('../../../testutil_v2.js')

describe('Mini Pasture', () => {
  test('builds free single-space pasture on play', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        food: 2,
        hand: ['mini-pasture-b002'],
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Mini Pasture')
    t.choose(game, '2,0')  // Choose space for the pasture

    // Card has passLeft: true — card is passed to other player after use
    t.testBoard(game, {
      dennis: {
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
          ],
        },
      },
    })
  })

  test('new pasture must be adjacent to existing when pastures exist', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        food: 2,
        hand: ['mini-pasture-b002'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
          ],
        },
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Mini Pasture')
    // Adjacent to existing pasture at (2,0): (2,1) is empty and adjacent
    t.choose(game, '2,1')

    t.testBoard(game, {
      dennis: {
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
            { spaces: [{ row: 2, col: 1 }] },
          ],
        },
      },
    })
  })
})
