const t = require('../../../testutil_v2.js')

describe('Case Builder', () => {
  test('onPlay gives 1 good per type when player has at least 2 of that good', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['case-builder-b105'],
        food: 3,
        grain: 2,
        vegetables: 2,
        reed: 2,
        wood: 2,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Case Builder')

    t.testBoard(game, {
      dennis: {
        occupations: ['case-builder-b105'],
        food: 4,
        grain: 3,
        vegetables: 3,
        reed: 3,
        wood: 3,
      },
    })
  })

  test('onPlay gives nothing for types where player has less than 2', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['case-builder-b105'],
        food: 1,
        grain: 0,
        vegetables: 1,
        reed: 0,
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Case Builder')

    t.testBoard(game, {
      dennis: {
        occupations: ['case-builder-b105'],
        food: 1,
        grain: 0,
        vegetables: 1,
        reed: 0,
        wood: 1,
      },
    })
  })
})
