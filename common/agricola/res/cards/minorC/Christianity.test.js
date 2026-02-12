const t = require('../../../testutil_v2.js')

describe('Christianity', () => {
  test('gives all other players 1 food on play', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Sheep Market'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['christianity-c038'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }], sheep: 1 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Christianity')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place gives 1 food
        animals: { sheep: 1 },
        minorImprovements: ['christianity-c038'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }], sheep: 1 }],
        },
      },
      micah: {
        food: 1, // from Christianity
      },
    })
  })
})
