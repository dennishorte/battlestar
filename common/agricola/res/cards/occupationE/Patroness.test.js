const t = require('../../../testutil_v2.js')

describe('Patroness', () => {
  test('gives 1 building resource when playing an occupation after Patroness', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['patroness-e163'],
        hand: ['test-occupation-1'],
        food: 1, // 2nd occ costs 1 food
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')
    // Patroness fires: choose a building resource
    t.choose(game, 'Take 1 wood')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 1,
        occupations: ['patroness-e163', 'test-occupation-1'],
      },
    })
  })

  test('can choose any building resource (clay, stone, reed)', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['patroness-e163'],
        hand: ['test-occupation-1'],
        food: 1, // 2nd occ costs 1 food
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')
    t.choose(game, 'Take 1 reed')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        reed: 1,
        occupations: ['patroness-e163', 'test-occupation-1'],
      },
    })
  })

  test('triggers each time an occupation is played', () => {
    // 3 players to get Lessons B available alongside Lessons A
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['patroness-e163'],
        hand: ['test-occupation-1', 'test-occupation-2'],
        food: 3, // 2nd occ via Lessons A costs 1 food + 3rd occ via Lessons B costs 2 food
      },
    })
    game.run()

    // Play first occupation via Lessons A (free, it's the 2nd occ after patroness → costs 1 food)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')
    t.choose(game, 'Take 1 stone')

    // micah + scott
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')

    // Play second occupation via Lessons B (costs 2 food for 3-player)
    t.choose(game, 'Lessons B')
    t.choose(game, 'Test Occupation 2')
    t.choose(game, 'Take 1 clay')

    // micah + scott
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        stone: 1,
        clay: 1,
        occupations: ['patroness-e163', 'test-occupation-1', 'test-occupation-2'],
      },
    })
  })

  test('does not trigger when Patroness itself is played', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['patroness-e163'],
      },
    })
    game.run()

    // Play Patroness itself — onPlayOccupation hook is on Patroness,
    // but Patroness only becomes active after being played, so the hook
    // fires for itself. However, the card text says "after this one",
    // which the hook handles correctly since onPlayOccupation fires
    // on all active cards when any occupation is played.
    t.choose(game, 'Lessons A')
    t.choose(game, 'Patroness')

    // No resource choice prompt — game moves to micah's turn
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 0,
        clay: 0,
        stone: 0,
        reed: 0,
        occupations: ['patroness-e163'],
      },
    })
  })
})
