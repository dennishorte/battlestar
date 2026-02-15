const t = require('../../../testutil_v2.js')

describe('House Artist', () => {
  test('onAction offers Build a room with 1 reed discount when using Traveling Players', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['house-artist-a149'],
        roomType: 'wood',
        wood: 5,
        reed: 1,
        food: 5,
      },
      micah: { food: 5 },
      scott: { food: 5 },
      eliya: { food: 5 },
    })
    game.run()

    t.choose(game, 'Traveling Players')
    t.choose(game, 'Build a room')
    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        occupations: ['house-artist-a149'],
        wood: 0,
        reed: 0,
        food: 6,
        farmyard: { rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }] },
      },
    })
  })

  test('allows skip', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['house-artist-a149'],
        roomType: 'wood',
        wood: 5,
        reed: 1,
        food: 5,
      },
      micah: { food: 5 },
      scott: { food: 5 },
      eliya: { food: 5 },
    })
    game.run()

    t.choose(game, 'Traveling Players')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['house-artist-a149'],
        wood: 5,
        reed: 1,
        food: 6,
      },
    })
  })
})
