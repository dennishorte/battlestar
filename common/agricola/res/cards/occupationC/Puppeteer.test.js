const t = require('../../../testutil_v2.js')

describe('Puppeteer', () => {
  // Card text: "Each time another player uses the 'Traveling Players'
  // accumulation space, you can pay them 1 food to immediately play an
  // occupation without paying an occupation cost."

  test('pays 1 food to play free occupation when another player uses Traveling Players', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['puppeteer-c152'],
        hand: ['test-occupation-1'],
        food: 3,
      },
    })
    game.run()

    // micah takes Traveling Players → Puppeteer triggers for dennis
    t.choose(game, 'Traveling Players')
    t.choose(game, 'Pay 1 food to play an occupation (free)')
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      dennis: {
        occupations: ['puppeteer-c152', 'test-occupation-1'],
        food: 2,
      },
    })
  })

  test('can skip the free occupation', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['puppeteer-c152'],
        hand: ['test-occupation-1'],
        food: 3,
      },
    })
    game.run()

    t.choose(game, 'Traveling Players')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['puppeteer-c152'],
        hand: ['test-occupation-1'],
        food: 3,
      },
    })
  })
})
