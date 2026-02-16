const t = require('../../../testutil_v2.js')

describe('Furnisher', () => {
  test('gives 2 wood when played', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['furnisher-d096'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Furnisher')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 2,
        occupations: ['furnisher-d096'],
      },
    })
  })

  test('onBuildRoom sets furnisher discount flag', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'minorA'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion', 'Major Improvement', 'Day Laborer', 'Forest'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['furnisher-d096'],
        roomType: 'wood',
        wood: 6,  // 5 for room + 1 for Handplow
        reed: 2,  // for room
        hand: ['handplow-a019'],
      },
      micah: { food: 10 },
    })
    game.run()

    // Dennis builds room → Furnisher onBuildRoom fires
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    // Verify discount flag is set
    const dennis = game.players.byName('dennis')
    expect(dennis.furnisherDiscount).toBe(true)

    // Micah takes Day Laborer
    t.choose(game, 'Day Laborer')

    // Dennis takes Major Improvement to play Handplow (costs 1 wood)
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Handplow')

    t.testBoard(game, {
      dennis: {
        wood: 0,   // 6 - 5 (room) - 1 (Handplow)
        reed: 0,   // 2 - 2 (room)
        occupations: ['furnisher-d096'],
        minorImprovements: ['handplow-a019'],
        roomType: 'wood',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('discount does not apply without building a room first', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'minorA'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement', 'Day Laborer', 'Forest', 'Clay Pit'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['furnisher-d096'],
        wood: 1, // exact cost for Handplow (no discount)
        hand: ['handplow-a019'],
      },
      micah: { food: 10 },
    })
    game.run()

    // Dennis builds Handplow without having built a room — no discount, costs 1 wood
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Handplow')

    t.testBoard(game, {
      dennis: {
        wood: 0, // 1 - 1 (Handplow full cost, no discount)
        occupations: ['furnisher-d096'],
        minorImprovements: ['handplow-a019'],
      },
    })
  })
})
