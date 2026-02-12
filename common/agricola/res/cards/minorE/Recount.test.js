const t = require('../../../testutil_v2.js')

describe('Recount', () => {
  test('gives 1 of each building resource where player has 4+', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['recount-e006'],
        wood: 5,
        clay: 4,
        stone: 3,
        reed: 0,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Recount')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 6,
        clay: 5,
        stone: 3,
        reed: 0,
        food: 1, // Meeting Place gives 1 food
        minorImprovements: ['recount-e006'],
      },
    })
  })
})
