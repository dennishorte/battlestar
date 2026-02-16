const t = require('../../../testutil_v2.js')

describe('Timber Shingle Maker', () => {
  // Card text: "When you renovate to stone, you can place up to 1 wood from
  // your supply in each of your rooms. During scoring, each such wood is
  // worth 1 bonus point."

  test('places wood in rooms on renovation to stone and scores BP', () => {
    // Renovation clay→stone costs 2 stone + 1 reed (2 rooms)
    // After: stone 5-2=3, reed 1-1=0, wood 2-2=0 (placed), clay stays 1
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['timber-shingle-maker-c132'],
        roomType: 'clay',
        clay: 1,
        reed: 1,
        stone: 5,
        wood: 2,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Place 2 wood in rooms')

    t.testBoard(game, {
      dennis: {
        occupations: ['timber-shingle-maker-c132'],
        roomType: 'stone',
        wood: 0,
        stone: 3,
        clay: 1,
        reed: 0,
      },
    })
  })

  test('scores 0 BP when skipping wood placement', () => {
    // Renovation clay→stone costs 2 stone + 1 reed (2 rooms)
    // Skip wood placement → 0 bonus points from getEndGamePoints
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['timber-shingle-maker-c132'],
        roomType: 'clay',
        clay: 1,
        reed: 1,
        stone: 5,
        wood: 2,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['timber-shingle-maker-c132'],
        roomType: 'stone',
        wood: 2,   // unchanged — skipped placement
        stone: 3,  // 5 - 2(renovation)
        clay: 1,
        reed: 0,   // 1 - 1(renovation)
        bonusPoints: 0,
      },
    })
  })
})
