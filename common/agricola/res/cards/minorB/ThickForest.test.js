const t = require('../../../testutil_v2.js')

describe('Thick Forest', () => {
  test('schedules wood on all remaining even-numbered rounds', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['thick-forest-b074'],
        clay: 5, // prereq: have 5 clay (card is free)
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Thick Forest')

    t.testBoard(game, {
      dennis: {
        clay: 5, // kept (card is free)
        food: 1, // from Meeting Place
        scheduled: { wood: { 2: 1, 4: 1, 6: 1, 8: 1, 10: 1, 12: 1, 14: 1 } },
        minorImprovements: ['thick-forest-b074'],
      },
    })
  })
})
