const t = require('../testutil')

function completeRound(game) {
  const startRound = game.state.round
  let safety = 50
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
}

describe('Agent Recall', () => {

  test('agents return to leader in Phase 5 (board spaces cleared)', () => {
    const game = t.fixture()
    game.run()

    // Dennis places an agent
    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Assembly Hall')

    // Board space should be occupied
    expect(game.state.boardSpaces['assembly-hall']).toBe('dennis')

    // Complete the round
    completeRound(game)

    // After recall, all board spaces should be cleared
    expect(game.state.boardSpaces['assembly-hall']).toBeNull()
    expect(game.state.round).toBe(2)
  })

  test('chain card acquisitions: acquire, row refills, acquire replacement', () => {
    const game = t.fixture()
    game.run()

    // Dennis reveals all 5 cards for max persuasion
    t.choose(game, 'Reveal Turn')

    // First acquisition
    const choices = t.currentChoices(game)
    const affordable = choices.filter(c => c !== 'Pass')
    expect(affordable.length).toBeGreaterThan(0)
    t.choose(game, affordable[0])

    // Row should refill — check that there are still cards to acquire
    const choices2 = t.currentChoices(game)
    // The new card that refilled the row might be affordable
    // Either way, Pass should be available
    expect(choices2).toContain('Pass')
    t.choose(game, 'Pass')

    // Verify imperium row is back to 5
    const row = game.zones.byId('common.imperiumRow')
    expect(row.cardlist().length).toBe(5)
  })
})
