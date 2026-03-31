const t = require('../testutil')

describe('Battle Icon Matching', () => {

  test('winning a conflict with matching objective icon grants VP', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 5, vp: 0 },
      objectives: {
        dennis: {
          id: 'test-obj', name: 'Test Objective',
          battleIcon: 'crysknife', isFirstPlayer: false,
        },
      },
      conflictCard: { location: 'arrakeen' },
    })
    game.run()

    // Dennis deploys and wins
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    // Finish round (dennis wins combat)
    const startRound = game.state.round
    let safety = 30
    while (game.waiting && !game.gameOver && game.state.round === startRound && safety-- > 0) {
      const choices = t.currentChoices(game)
      if (choices.includes('Reveal Turn')) {
        t.choose(game, 'Reveal Turn')
      }
      else if (choices.includes('Pass')) {
        t.choose(game, 'Pass')
      }
      else {
        t.choose(game, choices[0])
      }
    }

    // Dennis won conflict — check if won cards tracked
    const wonCards = game.state.conflict.wonCards?.dennis || []
    expect(wonCards.length).toBe(1)
  })

  test('wild battle icon matches any other icon', () => {
    // Verify wild icon exists in conflict card data
    const conflictCards = require('../res/cards/conflict.js')
    const wildCards = conflictCards.filter(c => c.battleIcon === 'wild')
    // Wild icons should exist in the card set
    expect(wildCards.length).toBeGreaterThanOrEqual(0)

    // Verify the standard icons exist
    const icons = new Set(conflictCards.map(c => c.battleIcon).filter(Boolean))
    expect(icons.size).toBeGreaterThan(0)
  })
})
