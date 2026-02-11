const t = require('../../../testutil_v2.js')

describe('Moldboard Plow', () => {
  test('plows extra field when using Farmland action', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['moldboard-plow-b019'],
        occupations: ['test-occupation-1'],
        wood: 2, // card cost
      },
    })
    game.run()

    // Play Moldboard Plow (sets charges = 2)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Moldboard Plow')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis uses Farmland → normal plow + MoldboardPlow extra plow
    t.choose(game, 'Farmland')
    t.choose(game, '2,0') // normal plow
    t.choose(game, '2,1') // extra plow from Moldboard Plow
    // Micah
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        occupations: ['test-occupation-1'],
        minorImprovements: ['moldboard-plow-b019'],
        farmyard: {
          fields: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
          ],
        },
      },
    })
  })
})
