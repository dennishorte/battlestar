const t = require('../../../testutil_v2.js')

describe('Wolf', () => {
  test('onPlay sets up pile', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wolf-e103'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }], // pasture for boar
        },
      },
    })
    game.run()

    // Play Wolf via Lessons A (triggers onPlay which sets pile)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Wolf')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['wolf-e103'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })

    // Verify the pile was set up: [clay, wood, grain] (grain on top)
    const cardState = game.cardState('wolf-e103')
    expect(cardState.pile).toEqual(['clay', 'wood', 'grain'])
  })

  test('matches top of pile and gives boar when obtaining matching resource', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wolf-e103'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    game.run()

    // Play Wolf (sets pile: [clay, wood, grain])
    t.choose(game, 'Lessons A')
    t.choose(game, 'Wolf')

    // Now Dennis needs to obtain grain (top of pile).
    // Micah's turn, then Dennis takes Grain Seeds.
    t.choose(game, 'Forest')      // micah
    t.choose(game, 'Grain Seeds') // dennis - triggers onObtainResource with 'grain'

    t.testBoard(game, {
      dennis: {
        grain: 2,   // 1 from Grain Seeds + 1 from Wolf bonus
        animals: { boar: 1 }, // from Wolf
        occupations: ['wolf-e103'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], boar: 1 }],
        },
      },
    })

    // Pile should now be [clay, wood] (grain popped)
    const cardState = game.cardState('wolf-e103')
    expect(cardState.pile).toEqual(['clay', 'wood'])
  })
})
