const t = require('../../../testutil_v2.js')

describe('Grassland Harrow', () => {
  test('schedules plow for round = current + building resources', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        hand: ['grassland-harrow-b018'],
        wood: 3, // 2 for card cost + 1 building resource in supply
        clay: 2,
        reed: 1,
        stone: 1,
      },
    })
    game.run()

    // Dennis plays Grassland Harrow via Meeting Place
    // Building resources after paying cost (2 wood): wood=1, clay=2, reed=1, stone=1 = 5
    // But onPlay checks resources at time of play, which is after card cost is paid
    // Actually, let me think: card cost { wood: 2 } is paid, then onPlay fires
    // So resources: wood=1+clay=2+reed=1+stone=1 = 5
    // Target round: 1 + 5 = 6
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Grassland Harrow')

    t.testBoard(game, {
      dennis: {
        wood: 1, // 3 - 2 (card cost)
        clay: 2,
        reed: 1,
        stone: 1,
        food: 1, // from Meeting Place
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['grassland-harrow-b018'],
        scheduled: { plows: [6] },
      },
    })
  })
})
