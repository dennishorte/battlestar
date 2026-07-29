const t = require('../../../testutil_v2.js')

describe('Skimmer Plow', () => {
  test('plow 2 fields on plow-field action', () => {
    const game = t.fixture({ cardSets: ['minorE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['skimmer-plow-e017'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
      actionSpaces: ['Farmland'],
    })
    game.run()

    t.choose(game, 'Farmland')
    t.choose(game, '2,2')  // first field
    t.choose(game, '2,3')  // second field

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['skimmer-plow-e017'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        farmyard: {
          fields: [{ row: 2, col: 2 }, { row: 2, col: 3 }],
        },
      },
    })
  })

  test('sow 1 fewer crop per field', () => {
    const game = t.fixture({ cardSets: ['minorE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['skimmer-plow-e017'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        grain: 2,
        farmyard: {
          fields: [{ row: 2, col: 2 }],
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 2, col: 2, cropType: 'grain' })

    t.testBoard(game, {
      dennis: {
        grain: 1,
        minorImprovements: ['skimmer-plow-e017'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        farmyard: {
          fields: [{ row: 2, col: 2, crop: 'grain', cropCount: 2 }],
        },
      },
    })

    const sowLogs = game.log.getLog().filter(
      e => e.template === '{player} sows {crop} at ({row},{col}) - {amount} total'
    )
    expect(sowLogs).toHaveLength(1)
    expect(sowLogs[0].args.amount).toEqual({ value: 2 })
  })
})
