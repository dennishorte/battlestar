const t = require('../../../testutil_v2.js')

describe('Resource Recycler', () => {
  // Card text: "Each time another player renovates to stone, if you live in
  // a clay house, you can pay 2 food to build a clay room at no cost."

  test('builds free clay room when another player renovates to stone', () => {
    // micah renovates clay→stone (costs 2 stone + 1 reed for 2 rooms)
    // dennis owns ResourceRecycler, has clay rooms, 2 food, and a valid build space
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
      ],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['resource-recycler-c149'],
        roomType: 'clay',
        food: 5,
      },
      micah: {
        roomType: 'clay',
        stone: 2,
        reed: 1,
        food: 10,
      },
    })
    game.run()

    // micah renovates clay→stone, triggering ResourceRecycler for dennis
    t.choose(game, 'House Redevelopment')
    // dennis gets the offer
    t.choose(game, 'Pay 2 food to build a free clay room')
    // dennis picks where to build the free room
    t.choose(game, '2,0')

    t.testBoard(game, {
      dennis: {
        occupations: ['resource-recycler-c149'],
        roomType: 'clay',
        food: 3,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
      micah: {
        roomType: 'stone',
        stone: 0,
        reed: 0,
        food: 10,
      },
    })
  })

  test('does not trigger when owner renovates', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['resource-recycler-c149'],
        roomType: 'clay',
        stone: 2,
        reed: 1,
        food: 5,
      },
      micah: { food: 10 },
    })
    game.run()

    // dennis renovates himself — should NOT trigger ResourceRecycler
    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        occupations: ['resource-recycler-c149'],
        roomType: 'stone',
        food: 5,
        stone: 0,
        reed: 0,
      },
    })
  })

  test('does not trigger on renovation to clay', () => {
    // micah renovates wood→clay — ResourceRecycler only triggers on stone
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
      ],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['resource-recycler-c149'],
        roomType: 'clay',
        food: 5,
      },
      micah: {
        roomType: 'wood',
        clay: 2,
        reed: 1,
        food: 10,
      },
    })
    game.run()

    // micah renovates wood→clay — no prompt for dennis
    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        occupations: ['resource-recycler-c149'],
        roomType: 'clay',
        food: 5,
      },
      micah: {
        roomType: 'clay',
        food: 10,
      },
    })
  })
})
