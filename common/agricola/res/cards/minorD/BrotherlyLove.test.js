const t = require('../../../testutil_v2.js')

describe('Brotherly Love', () => {
  test('4 family members — after 2nd person, 3rd and 4th back-to-back', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['brotherly-love-d024'],
        familyMembers: 4,
        rooms: 4,
      },
    })
    game.run()

    // Dennis turn 1
    t.choose(game, 'Forest')
    // Micah turn 1
    t.choose(game, 'Day Laborer')
    // Dennis turn 2 — triggers Brotherly Love
    t.choose(game, 'Clay Pit')
    // Back-to-back: Dennis 3rd person (bonus)
    t.choose(game, 'Grain Seeds')
    // Back-to-back: Dennis 4th person (bonus)
    t.choose(game, 'Reed Bank')

    // Micah turn 2
    t.choose(game, 'Meeting Place')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['brotherly-love-d024'],
        familyMembers: 4,
        rooms: 4,
        wood: 3,
        clay: 1,
        grain: 1,
        reed: 1,
      },
    })
  })

  test('4th person can use same action space as 3rd', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['brotherly-love-d024'],
        familyMembers: 4,
        rooms: 4,
      },
    })
    game.run()

    // Dennis turn 1
    t.choose(game, 'Forest')
    // Micah turn 1
    t.choose(game, 'Day Laborer')
    // Dennis turn 2 — triggers Brotherly Love
    t.choose(game, 'Clay Pit')
    // 3rd person
    t.choose(game, 'Grain Seeds')
    // 4th person — same space as 3rd should be allowed
    t.choose(game, 'Grain Seeds')

    // Micah turn 2
    t.choose(game, 'Meeting Place')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['brotherly-love-d024'],
        familyMembers: 4,
        rooms: 4,
        wood: 3,
        clay: 1,
        grain: 2, // Grain Seeds twice
      },
    })
  })

  test('not triggered with != 4 family members', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['brotherly-love-d024'],
        // Default 2 family members
      },
    })
    game.run()

    // Dennis turn 1
    t.choose(game, 'Forest')
    // Micah turn 1
    t.choose(game, 'Day Laborer')
    // Dennis turn 2 — no Brotherly Love (only 2 family members)
    t.choose(game, 'Clay Pit')
    // Micah turn 2 (next is Micah, not Dennis bonus)
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['brotherly-love-d024'],
        wood: 3,
        clay: 1,
      },
    })
  })
})
