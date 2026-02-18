const t = require('../../../testutil_v2.js')

describe('Blighter', () => {
  test('gives bonus points for complete stages left when played in round 2', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['blighter-e101'],
      },
    })
    game.run()

    // Round 2: stageStartRounds [1, 5, 8, 10, 12, 14], filter r > 2 => 5 stages left
    t.choose(game, 'Lessons A')
    t.choose(game, 'Blighter')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        bonusPoints: 5,
        occupations: ['blighter-e101'],
      },
    })
  })

  test('blocks further occupation play after Blighter', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['blighter-e101', 'test-occupation-1'],
        food: 1, // for 2nd occ cost
      },
    })
    game.run()

    // Play Blighter
    t.choose(game, 'Lessons A')
    t.choose(game, 'Blighter')

    // Finish round 1
    t.choose(game, 'Day Laborer') // micah
    t.choose(game, 'Forest')      // dennis
    t.choose(game, 'Clay Pit')    // micah

    // Round 2: Blighter blocks occupation play — Lessons A is not available
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['blighter-e101'], // only Blighter, not test-occupation-1
        hand: ['test-occupation-1'],    // still in hand (blocked by Blighter)
        food: 1,
        grain: 1, // from Grain Seeds
        wood: 3, // from Forest in round 1
        bonusPoints: 5,
      },
    })
  })
})
