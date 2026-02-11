const t = require('../../../testutil_v2.js')
const util = require('../../../../lib/util')

describe('Paper Knife', () => {
  let originalSelect

  beforeEach(() => {
    originalSelect = util.array.select
  })

  afterEach(() => {
    util.array.select = originalSelect
  })

  test('randomly plays one of three occupations for free', () => {
    // Mock select to always return the second element
    util.array.select = (arr) => arr[1]

    const game = t.fixture()
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        hand: [
          'paper-knife-a003',
          'test-occupation-1',
          'test-occupation-2',
          'test-occupation-3',
        ],
        wood: 1,
        food: 10,
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    // Play Paper Knife via Major Improvement (it's a minor improvement)
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Paper Knife')

    // With exactly 3 occupations, all are auto-selected.
    // Mock returns second element → test-occupation-2 is played for free.

    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Forest')       // micah

    t.testBoard(game, {
      dennis: {
        wood: 0,
        food: 10,
        grain: 1,
        hand: ['test-occupation-1', 'test-occupation-3'],
        occupations: ['test-occupation-2'],
        minorImprovements: ['paper-knife-a003'],
      },
    })
  })

  test('player selects 3 from more than 3 occupations', () => {
    // Mock select to always return the first element
    util.array.select = (arr) => arr[0]

    const game = t.fixture()
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        hand: [
          'paper-knife-a003',
          'test-occupation-1',
          'test-occupation-2',
          'test-occupation-3',
          'test-occupation-4',
        ],
        wood: 1,
        food: 10,
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Paper Knife')

    // With 4 occupations, player must select 3
    t.choose(game, 'Test Occupation 2', 'Test Occupation 3', 'Test Occupation 4')

    // Mock returns first element → test-occupation-2 is played for free

    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Forest')       // micah

    t.testBoard(game, {
      dennis: {
        wood: 0,
        food: 10,
        grain: 1,
        hand: ['test-occupation-1', 'test-occupation-3', 'test-occupation-4'],
        occupations: ['test-occupation-2'],
        minorImprovements: ['paper-knife-a003'],
      },
    })
  })
})
