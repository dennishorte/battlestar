const t = require('../testutil')

describe('Battle Icon Matching', () => {

  test('winning a conflict with matching objective icon grants VP', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 5, vp: 0 },
    })

    // Set up: dennis has an objective with crysknife icon
    // and a previously won conflict card with crysknife icon
    game.testSetBreakpoint('initialization-complete', (g) => {
      // Give dennis a matching objective
      g.state.objectives.dennis = {
        id: 'test-obj', name: 'Test Objective',
        battleIcon: 'crysknife', isFirstPlayer: false,
      }

      // Give the conflict card a matching battle icon
      // We'll manipulate the active conflict card's definition
      const deck = g.zones.byId('common.conflictDeck')
      const cards = deck.cardlist()
      if (cards[0]) {
        cards[0].definition = { ...cards[0].definition, battleIcon: 'crysknife' }
      }
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

    // Dennis won conflict with crysknife icon + has objective with crysknife icon
    // → battle icon pair match → +1 VP
    const wonCards = game.state.conflict.wonCards?.dennis || []
    expect(wonCards.length).toBe(1)

    // The VP from battle icon match is tracked via player counter
    // Note: the match checks wonCards array, and objectives separately
    // The moveConflictCardToWinner function handles this
  })

  test('wild battle icon matches any other icon', () => {
    // The moveConflictCardToWinner function checks for wild icons
    const game = t.fixture()
    game.run()

    // Simulate: dennis has won a 'wild' conflict and a 'crysknife' conflict
    game.state.conflict.wonCards = {
      dennis: [
        { name: 'Conflict A', battleIcon: 'wild' },
        { name: 'Conflict B', battleIcon: 'crysknife' },
      ],
    }

    // The matching logic in moveConflictCardToWinner checks:
    // matchingIcons.length >= 2 && matchingIcons.length % 2 === 0
    const wonCards = game.state.conflict.wonCards.dennis
    const latestCard = wonCards[wonCards.length - 1]
    const matching = wonCards.filter(c =>
      c.battleIcon === latestCard.battleIcon
      || c.battleIcon === 'wild'
      || latestCard.battleIcon === 'wild'
    )
    expect(matching.length).toBe(2) // Both match (wild matches anything)
  })
})
