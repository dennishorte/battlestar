const t = require('../../../testutil_v2.js')

describe('Beating Rod', () => {
  test('gives 1 reed when no reed to exchange', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['beating-rod-b009'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Beating Rod')
    // Only 1 choice (Get 1 reed) → auto-responded

    t.testBoard(game, {
      dennis: {
        reed: 1,
        food: 1, // from Meeting Place
        minorImprovements: ['beating-rod-b009'],
      },
    })
  })

  test('can exchange 1 reed for 1 cattle', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['beating-rod-b009'],
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Beating Rod')
    t.choose(game, 'Exchange 1 reed for 1 cattle')

    t.testBoard(game, {
      dennis: {
        reed: 0,
        food: 1,
        pet: 'cattle',
        animals: { cattle: 1 },
        minorImprovements: ['beating-rod-b009'],
      },
    })
  })

  test('offers choice when player has reed', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['beating-rod-b009'],
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Beating Rod')

    // Both options should be available
    expect(t.currentChoices(game)).toContain('Get 1 reed')
    expect(t.currentChoices(game)).toContain('Exchange 1 reed for 1 cattle')

    t.choose(game, 'Get 1 reed')

    t.testBoard(game, {
      dennis: {
        reed: 2, // 1 starting + 1 from Beating Rod
        food: 1,
        minorImprovements: ['beating-rod-b009'],
      },
    })
  })
})
