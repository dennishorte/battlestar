const t = require('../../../testutil_v2.js')

describe('Brewing Water', () => {
  test('pays 1 grain to schedule food on next 6 rounds when fishing', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['brewing-water-b060'],
        grain: 1, // to pay for Brewing Water effect
      },
    })
    game.run()

    // Dennis uses Fishing → Brewing Water offers to pay 1 grain
    t.choose(game, 'Fishing')
    t.choose(game, 'Accept')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Meeting Place')
    // Micah
    t.choose(game, 'Forest')

    // By the time assertions run, game has advanced to round 2 and delivered round 2's food
    t.testBoard(game, {
      dennis: {
        food: 3, // 1 from Fishing + 1 from Meeting Place + 1 scheduled (round 2 delivered)
        grain: 0, // paid 1 for Brewing Water
        minorImprovements: ['brewing-water-b060'],
        scheduled: { food: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 } },
      },
    })
  })

  test('no effect when declining offer', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['brewing-water-b060'],
        grain: 1,
      },
    })
    game.run()

    // Dennis uses Fishing → declines Brewing Water
    t.choose(game, 'Fishing')
    t.choose(game, 'Skip')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Meeting Place')
    // Micah
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        food: 2, // 1 from Fishing + 1 from Meeting Place
        grain: 1, // not spent
        minorImprovements: ['brewing-water-b060'],
      },
    })
  })
})
