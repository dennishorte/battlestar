const t = require('../../../testutil_v2.js')

describe('Store of Experience', () => {
  test('gives stone with 0-3 occupations in hand', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['store-of-experience-b005', 'test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Store of Experience')

    t.testBoard(game, {
      dennis: {
        stone: 1, // 2 occupations in hand → 0-3 range → stone
        food: 1,
        hand: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['store-of-experience-b005'],
      },
    })
  })

  test('gives reed with 4 occupations in hand', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: [
          'store-of-experience-b005',
          'test-occupation-1', 'test-occupation-2',
          'test-occupation-3', 'test-occupation-4',
        ],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Store of Experience')

    t.testBoard(game, {
      dennis: {
        reed: 1, // 4 occupations in hand → reed
        food: 1,
        hand: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4'],
        minorImprovements: ['store-of-experience-b005'],
      },
    })
  })

  test('gives clay with 5 occupations in hand', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: [
          'store-of-experience-b005',
          'test-occupation-1', 'test-occupation-2',
          'test-occupation-3', 'test-occupation-4',
          'test-occupation-5',
        ],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Store of Experience')

    t.testBoard(game, {
      dennis: {
        clay: 1, // 5 occupations in hand → clay
        food: 1,
        hand: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4', 'test-occupation-5'],
        minorImprovements: ['store-of-experience-b005'],
      },
    })
  })

  test('gives wood with 6+ occupations in hand', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: [
          'store-of-experience-b005',
          'test-occupation-1', 'test-occupation-2',
          'test-occupation-3', 'test-occupation-4',
          'test-occupation-5', 'test-occupation-6',
        ],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Store of Experience')

    t.testBoard(game, {
      dennis: {
        wood: 1, // 6 occupations in hand → wood
        food: 1,
        hand: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4', 'test-occupation-5', 'test-occupation-6'],
        minorImprovements: ['store-of-experience-b005'],
      },
    })
  })
})
