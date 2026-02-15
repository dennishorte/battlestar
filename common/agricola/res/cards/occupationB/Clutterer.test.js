const t = require('../../../testutil_v2.js')

describe('Clutterer', () => {
  // Card text: "During scoring, you get 1 bonus point for each card played
  // after this one that has 'accumulation space(s)' in its text."
  // Uses onPlay (to record state) + getEndGamePoints. Card is 1+ players.
  // Must play from hand so onPlay fires.

  test('scores points for cards with accumulation space text played after', () => {
    // Play Clutterer from hand, then play Mineralogist (text has "accumulation space")
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1'],
        hand: ['clutterer-b100', 'mineralogist-b122'],
        food: 5,
      },
    })
    game.run()

    // Round 1 (3 players × 2 workers = 6 actions)
    t.choose(game, 'Lessons A')     // dennis (2nd occ, costs 1 food)
    t.choose(game, 'Clutterer')
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Clay Pit')      // player3
    t.choose(game, 'Lessons B')     // dennis (Lessons B: 2 food in 3p)
    t.choose(game, 'Mineralogist')
    t.choose(game, 'Grain Seeds')   // micah
    t.choose(game, 'Day Laborer')   // player3

    // Mineralogist text contains "accumulation space" → 1 BP from Clutterer
    // Score: fields:-1 pastures:-1 grain:-1 veg:-1 sheep:-1 boar:-1 cattle:-1
    //        rooms:0(2wood) family:6 unused:-13 cardPts:0
    //        bonusPts: 1(Clutterer: 1 card after with "accumulation space")
    //        food: 5 - 1(occ cost) - 2(Lessons B) = 2
    // Total: -1-1-1-1-1-1-1+0+6-13+0+1 = -13
    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1', 'clutterer-b100', 'mineralogist-b122'],
        food: 2,
        score: -13,
      },
    })
  })

  test('scores 0 when no accumulation-text cards played after', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['clutterer-b100'],
        food: 3,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')     // dennis (1st occ, free)
    t.choose(game, 'Clutterer')
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // No cards played after Clutterer → 0 bonus
    // Score: default -14 + 0 = -14
    t.testBoard(game, {
      dennis: {
        occupations: ['clutterer-b100'],
        food: 5,  // 3 + 2(DL)
        score: -14,
      },
    })
  })
})
