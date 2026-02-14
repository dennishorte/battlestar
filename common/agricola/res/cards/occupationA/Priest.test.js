const t = require('../../../testutil_v2.js')

describe('Priest', () => {
  test('onPlay grants resources if clay house with exactly 2 rooms', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        hand: ['priest-a125'],
        roomType: 'clay',
        farmyard: {
          rooms: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Priest')

    t.testBoard(game, {
      dennis: {
        occupations: ['priest-a125'],
        roomType: 'clay',
        clay: 3,
        reed: 2,
        stone: 2,
        farmyard: {
          rooms: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
          ],
        },
      },
    })
  })

  test('onPlay does not grant resources if not clay house', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        hand: ['priest-a125'],
        roomType: 'wood',
        farmyard: {
          rooms: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Priest')

    t.testBoard(game, {
      dennis: {
        occupations: ['priest-a125'],
        roomType: 'wood',
        clay: 0,
        reed: 0,
        stone: 0,
      },
    })
  })

  test('onPlay does not grant resources if not exactly 2 rooms', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        hand: ['priest-a125'],
        roomType: 'clay',
        farmyard: {
          rooms: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
            { row: 2, col: 0 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Priest')

    t.testBoard(game, {
      dennis: {
        occupations: ['priest-a125'],
        roomType: 'clay',
        clay: 0,
        reed: 0,
        stone: 0,
        farmyard: {
          rooms: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
            { row: 2, col: 0 },
          ],
        },
      },
    })
  })
})
