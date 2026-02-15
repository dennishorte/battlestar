const t = require('../../../testutil_v2.js')

describe('Scholar', () => {
  // Card text: "Once you live in a stone house, at the start of each round,
  // you can play an occupation for 1 food, or a minor improvement."
  // Uses onRoundStart. Card is 1+ players.

  test('offers to play occupation for 1 food when in stone house', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['scholar-b097'],
        hand: ['test-occupation-1'],
        roomType: 'stone',
        food: 3,
      },
    })
    game.run()

    // Scholar offers to play a card
    t.choose(game, 'Play an occupation (1 food)')
    t.choose(game, 'Test Occupation 1')

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 4,  // 3 - 1(Scholar cost) + 2(DL)
        occupations: ['scholar-b097', 'test-occupation-1'],
        roomType: 'stone',
      },
    })
  })

  test('does not trigger in wood house', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['scholar-b097'],
        hand: ['test-occupation-1'],
        food: 3,
      },
    })
    game.run()

    // No Scholar offer — straight to action
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 5,  // 3 + 2(DL)
        occupations: ['scholar-b097'],
        hand: ['test-occupation-1'],
      },
    })
  })

  test('can skip the offer', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['scholar-b097'],
        hand: ['test-occupation-1'],
        roomType: 'stone',
        food: 3,
      },
    })
    game.run()

    t.choose(game, 'Skip')
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 5,  // 3 + 2(DL), no Scholar cost
        occupations: ['scholar-b097'],
        hand: ['test-occupation-1'],
        roomType: 'stone',
      },
    })
  })
})
