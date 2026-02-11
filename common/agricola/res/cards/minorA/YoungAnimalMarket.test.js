const t = require('../../../testutil_v2.js')

describe('Young Animal Market', () => {
  test('exchanges 1 sheep for 1 cattle on play via Meeting Place', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['young-animal-market-a009'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }], sheep: 2 },
            { spaces: [{ row: 0, col: 2 }] },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Young Animal Market')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 from Meeting Place
        hand: [],
        animals: { sheep: 1, cattle: 1 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }], sheep: 1 },
            { spaces: [{ row: 0, col: 2 }], cattle: 1 },
          ],
        },
      },
      micah: {
        hand: ['young-animal-market-a009'], // passLeft
      },
    })
  })
})
