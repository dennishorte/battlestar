const t = require('../../../testutil_v2.js')
const util = require('../../../../lib/util')

describe('Moonshine', () => {
  let originalSelect

  beforeEach(() => {
    originalSelect = util.array.select
  })

  afterEach(() => {
    util.array.select = originalSelect
  })

  test('play random occupation for 2 food', () => {
    // Mock select to return the first occupation
    util.array.select = (arr) => arr[0]

    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['moonshine-b003', 'test-occupation-1'],
        food: 3, // 2 for moonshine occupation cost + 1 buffer
      },
    })
    game.run()

    // Play Moonshine via Meeting Place
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Moonshine')
    // Moonshine effect: mock selects test-occupation-1, choose to play it
    t.choose(game, 'Play Test Occupation 1 for 2 food')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 2, // 3 - 2 (occupation cost) + 1 (Meeting Place)
        wood: 3, // from Forest
        occupations: ['test-occupation-1'],
        minorImprovements: ['moonshine-b003'],
      },
    })
  })

  test('give random occupation to left player', () => {
    // Mock select to return the first occupation
    util.array.select = (arr) => arr[0]

    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['moonshine-b003', 'test-occupation-1'],
      },
    })
    game.run()

    // Play Moonshine via Meeting Place
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Moonshine')
    // Moonshine effect: mock selects test-occupation-1, choose to give to left player
    t.choose(game, 'Give Test Occupation 1 to left player')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place only
        wood: 3, // from Forest
        minorImprovements: ['moonshine-b003'],
      },
    })

    // Verify occupation moved to Micah's hand
    const micah = game.players.byName('micah')
    const micahHand = micah.hand.map(id => id)
    expect(micahHand).toContain('test-occupation-1')
  })
})
