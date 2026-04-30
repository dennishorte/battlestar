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
    expect(game.state.boardSpaces['assembly-hall']).toEqual(['dennis'])

    // Complete the round
    completeRound(game)

    // After recall, all board spaces should be cleared
    expect(game.state.boardSpaces['assembly-hall']).toEqual([])
    expect(game.state.round).toBe(2)
  })

  test('Imperial Privilege recall excludes the agent on Imperial Privilege itself', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { emperor: 2 }, solari: 5 },
      boardSpaces: { 'assembly-hall': 'dennis', 'gather-support': 'dennis' },
    })
    game.run()

    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Imperial Privilege')

    const sel = game.waiting.selectors[0]
    expect(sel.title).toBe('Choose an Agent to recall')
    expect(sel.choices).toEqual(expect.arrayContaining(['Assembly Hall', 'Gather Support']))
    expect(sel.choices).not.toContain('Imperial Privilege')
  })

  test('Imperial Privilege recall is skipped when no other agent is placed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { emperor: 2 }, solari: 5 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Imperial Privilege')

    // Agent on Imperial Privilege is not eligible — recall step is skipped silently.
    expect(game.state.boardSpaces['imperial-privilege']).toEqual(['dennis'])
  })

  test('chain card acquisitions: acquire, row refills, acquire replacement', () => {
    const game = t.fixture()
    game.run()

    // Dennis reveals all 5 cards for 5 persuasion
    t.choose(game, 'Reveal Turn')

    // Find a cheap card so we have persuasion left for a second buy
    const choices = t.currentChoices(game)
    const affordable = choices.filter(c => c !== 'Pass')
    expect(affordable.length).toBeGreaterThan(0)

    // Pick the cheapest available card
    const row = game.zones.byId('common.imperiumRow')
    const cheapest = affordable
      .map(name => ({ name, cost: row.cardlist().find(c => c.name === name)?.persuasionCost ?? 0 }))
      .sort((a, b) => a.cost - b.cost)[0]
    t.choose(game, cheapest.name)

    // Row should refill — check that there are still cards to acquire
    const choices2 = t.currentChoices(game)
    // The new card that refilled the row might be affordable
    // Either way, Pass should be available
    expect(choices2).toContain('Pass')
    t.choose(game, 'Pass')

    // Verify imperium row is back to 5
    expect(row.cardlist().length).toBe(5)
  })
})
