const t = require('../../../testutil_v2.js')

describe('Building Expert', () => {
  test('onAction gives wood when using Resource Market as 1st person', () => {
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['building-expert-a163'],
        wood: 0,
      },
    })
    game.run()

    // Dennis uses Resource Market as his 1st person this round
    t.choose(game, 'Resource Market')
    t.choose(game, 'reed') // choose reed from the resource choice

    t.testBoard(game, {
      dennis: {
        occupations: ['building-expert-a163'],
        wood: 1,  // Building Expert bonus: 1st person = wood
        food: 1,  // from Resource Market
        reed: 1,  // chosen resource
      },
    })
  })

  test('onAction gives clay when using Resource Market as 2nd person', () => {
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['building-expert-a163'],
        clay: 0,
      },
    })
    game.run()

    // Dennis takes Day Laborer as his 1st person
    t.choose(game, 'Day Laborer')
    // Other players take their turns
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // scott
    t.choose(game, 'Clay Pit')     // eliya
    // Dennis uses Resource Market as his 2nd person
    t.choose(game, 'Resource Market')
    t.choose(game, 'stone') // choose stone from the resource choice

    t.testBoard(game, {
      dennis: {
        occupations: ['building-expert-a163'],
        clay: 1,   // Building Expert bonus: 2nd person = clay
        food: 3,   // 2 from Day Laborer + 1 from Resource Market
        stone: 1,  // chosen resource
      },
    })
  })
})
