const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

// Play through a complete round (strategy + action + status)
function playRound(game, opts = {}) {
  const dennisCard = opts.dennisCard || 'leadership'
  const micahCard = opts.micahCard || 'diplomacy'

  // Strategy phase
  pickStrategyCards(game, dennisCard, micahCard)

  // Action phase: both use strategy cards then pass
  t.choose(game, 'Strategic Action')  // dennis: leadership
  t.choose(game, 'Pass')             // micah declines secondary
  t.choose(game, 'Strategic Action')  // micah: diplomacy
  t.choose(game, 'hacan-home')
  t.choose(game, 'Pass')             // dennis declines secondary
  t.choose(game, 'Pass')
  t.choose(game, 'Pass')

  // Status phase: redistribution
  t.choose(game, 'Done')
  t.choose(game, 'Done')
}

describe('Multi-Round Play', () => {
  test('game progresses through multiple rounds', () => {
    const game = t.fixture()
    game.run()

    // Round 1
    playRound(game)
    expect(game.state.round).toBe(2)

    // Round 2
    playRound(game)
    expect(game.state.round).toBe(3)
  })

  test('strategy cards available again each round', () => {
    const game = t.fixture()
    game.run()

    playRound(game)

    // Round 2: same cards should be available
    expect(game.state.phase).toBe('strategy')
    const choices = t.currentChoices(game)
    expect(choices).toContain('leadership')
    expect(choices).toContain('diplomacy')
  })

  test('command tokens accumulate across rounds', () => {
    const game = t.fixture()
    game.run()

    // Round 1: dennis gets 3 (leadership primary) + 3 (status: 2+1 Versatile)
    playRound(game)

    // 3 (start) + 3 (leadership) - 1 (diplomacy token) + 3 (status) = 8
    expect(game.players.byName('dennis').commandTokens.tactics).toBe(8)

    // Round 2: leadership primary +3, diplomacy -1, status +3
    playRound(game)

    // 8 + 3 (leadership) - 1 (diplomacy) + 3 (status) = 13
    expect(game.players.byName('dennis').commandTokens.tactics).toBe(13)
  })

  test('planets ready each round', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        planets: {
          'jord': { exhausted: true },
        },
      },
    })
    game.run()

    // Jord starts exhausted
    expect(game.state.planets['jord'].exhausted).toBe(true)

    playRound(game)

    // After status phase, planets should be ready
    expect(game.state.planets['jord'].exhausted).toBe(false)
  })

  test('objectives accumulate across rounds', () => {
    const game = t.fixture()
    game.run()

    playRound(game)
    const objCount1 = game.state.revealedObjectives.length
    expect(objCount1).toBe(1)

    playRound(game)
    expect(game.state.revealedObjectives.length).toBe(2)
  })

  test('action cards accumulate across rounds', () => {
    const game = t.fixture()
    game.run()

    playRound(game)

    // Dennis (Sol) has Neural Motivator: draws 2 per status phase
    expect(game.players.byName('dennis').actionCards.length).toBe(2)

    playRound(game)
    // Re-read after replay
    expect(game.players.byName('dennis').actionCards.length).toBe(4)
  })

  test('agenda phase activates when custodians removed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      custodiansRemoved: true,
      agendaDeck: [
        'mutiny', 'economic-equality',
        'compensated-disarmament', 'public-execution',
      ],
    })
    game.run()

    // Strategy phase
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Action phase
    t.choose(game, 'Strategic Action')
    t.choose(game, 'Pass')  // micah declines secondary
    t.choose(game, 'Strategic Action')
    t.choose(game, 'hacan-home')
    t.choose(game, 'Pass')  // dennis declines secondary
    t.choose(game, 'Pass')
    t.choose(game, 'Pass')

    // Status phase
    t.choose(game, 'Done')
    t.choose(game, 'Done')

    // Agenda phase should start
    expect(game.state.phase).toBe('agenda')
  })
})
