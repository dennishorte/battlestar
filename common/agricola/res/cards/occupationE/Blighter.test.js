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

    // Round 2: Dennis takes Lessons A — Blighter blocks occupation play
    t.choose(game, 'Lessons A')
    // Occupation is blocked, so it skips the play. Dennis still has test-occupation-1 in hand.

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['blighter-e101'], // only Blighter, not test-occupation-1
        hand: ['test-occupation-1'],    // still in hand (blocked)
        food: 1, // unspent (blocked from paying occ cost)
        wood: 3, // from Forest in round 1
        bonusPoints: 5,
      },
    })
  })
})
