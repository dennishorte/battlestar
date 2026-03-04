const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

// Run through a full round (strategy + action + status) to reach agenda phase
function playToAgenda(game, opts = {}) {
  pickStrategyCards(game, opts.dennisCard || 'leadership', opts.micahCard || 'diplomacy')
  // Both use strategy cards then pass
  t.choose(game, 'Strategic Action')  // dennis: leadership
  t.choose(game, 'Done')             // allocate tokens
  t.choose(game, 'Strategic Action')  // micah: diplomacy (needs system choice)
  t.choose(game, 'hacan-home')        // micah picks system for diplomacy
  t.choose(game, 'Pass')             // dennis declines diplomacy secondary
  t.choose(game, 'Pass')              // dennis passes
  t.choose(game, 'Pass')              // micah passes
  // Status phase
  t.choose(game, 'Done')
  t.choose(game, 'Done')
}

describe('Agenda Phase', () => {
  describe('Activation', () => {
    test('agenda phase only after custodians removed', () => {
      const game = t.fixture()
      game.run()

      // Play a full round with custodians NOT removed
      playToAgenda(game)

      // Should skip agenda phase and go to round 2 strategy
      expect(game.state.round).toBe(2)
      expect(game.state.phase).toBe('strategy')
    })

    test('agenda phase runs when custodians removed', () => {
      const game = t.fixture()
      t.setBoard(game, {
        custodiansRemoved: true,
        agendaDeck: ['mutiny', 'economic-equality'],
      })
      game.run()

      // Play a full round
      playToAgenda(game)

      // After status phase, agenda phase should be waiting for a vote
      expect(game.state.phase).toBe('agenda')
      const waiting = game.waiting.selectors[0]
      expect(waiting.title).toContain('Vote on')
    })
  })

  describe('Voting', () => {
    test('players vote sequentially starting left of speaker', () => {
      const game = t.fixture()
      t.setBoard(game, {
        custodiansRemoved: true,
        speaker: 'dennis',
        agendaDeck: ['mutiny', 'economic-equality'],
      })
      game.run()
      playToAgenda(game)

      // Speaker is dennis, so micah votes first (left of speaker)
      const waiting = game.waiting.selectors[0]
      expect(waiting.actor).toBe('micah')
    })

    test('player can abstain from voting', () => {
      const game = t.fixture()
      t.setBoard(game, {
        custodiansRemoved: true,
        speaker: 'dennis',
        agendaDeck: ['mutiny', 'economic-equality'],
      })
      game.run()
      playToAgenda(game)

      // Micah abstains from first agenda
      t.choose(game, 'Abstain')

      // Dennis votes next (or speaker breaks tie if all abstain)
      const waiting = game.waiting.selectors[0]
      expect(waiting.actor).toBe('dennis')
    })

    test('player can vote For or Against', () => {
      const game = t.fixture()
      t.setBoard(game, {
        custodiansRemoved: true,
        speaker: 'dennis',
        agendaDeck: ['mutiny', 'economic-equality'],
      })
      game.run()
      playToAgenda(game)

      // Micah votes For
      t.choose(game, 'For')

      // Micah exhausts planets for votes (optional selection)
      const choices = t.currentChoices(game)
      // Should see Hacan planets available
      expect(choices.length).toBeGreaterThan(0)
    })

    test('for-against agenda resolves with most votes', () => {
      const game = t.fixture()
      t.setBoard(game, {
        custodiansRemoved: true,
        speaker: 'dennis',
        agendaDeck: ['mutiny', 'economic-equality'],
      })
      game.run()
      playToAgenda(game)

      // Agenda 1: Mutiny (for-against)
      // Micah votes For, exhausts all Hacan planets
      t.choose(game, 'For')
      // Select all available planets (min: 0 allows empty selection too)
      const micahChoices = t.currentChoices(game)
      // Exhaust planets for influence
      for (const choice of micahChoices) {
        t.choose(game, choice)
        break  // Just exhaust first planet
      }

      // Dennis votes Against, exhausts jord
      t.choose(game, 'Against')
      const dennisChoices = t.currentChoices(game)
      for (const choice of dennisChoices) {
        t.choose(game, choice)
        break
      }

      // Agenda 2 should now be waiting
      // (The exact resolution depends on influence values)
      expect(game.state.phase).toBe('agenda')
    })

    test('speaker breaks tie when no votes cast', () => {
      const game = t.fixture()
      t.setBoard(game, {
        custodiansRemoved: true,
        speaker: 'dennis',
        agendaDeck: ['mutiny', 'economic-equality'],
      })
      game.run()
      playToAgenda(game)

      // Both abstain from first agenda
      t.choose(game, 'Abstain')  // micah
      t.choose(game, 'Abstain')  // dennis

      // Speaker should break the tie
      const waiting = game.waiting.selectors[0]
      expect(waiting.title).toBe('Speaker breaks tie')
      expect(waiting.actor).toBe('dennis')
    })
  })

  describe('State', () => {
    test('custodiansRemoved flag persists', () => {
      const game = t.fixture()
      t.setBoard(game, {
        custodiansRemoved: true,
      })
      game.run()

      expect(game.state.custodiansRemoved).toBe(true)
    })

    test('custodiansRemoved starts false', () => {
      const game = t.fixture()
      game.run()

      expect(game.state.custodiansRemoved).toBe(false)
    })

    test('speaker can be set via setBoard', () => {
      const game = t.fixture()
      t.setBoard(game, {
        speaker: 'micah',
      })
      game.run()

      expect(game.state.speaker).toBe('micah')
    })

    test('speaker defaults to first player', () => {
      const game = t.fixture()
      game.run()

      expect(game.state.speaker).toBe('dennis')
    })
  })

  describe('Influence', () => {
    test('player influence comes from ready planets', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      // Sol has Jord: 2 influence
      expect(dennis.getTotalInfluence()).toBe(2)
    })

    test('exhausted planets contribute no influence', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          planets: {
            'jord': { exhausted: true },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.getTotalInfluence()).toBe(0)
    })

    test('multiple planets sum influence', () => {
      const game = t.fixture()
      t.setBoard(game, {
        micah: {
          planets: {
            'arretze': { exhausted: false },
            'hercant': { exhausted: false },
            'kamdorn': { exhausted: false },
          },
        },
      })
      game.run()

      const micah = game.players.byName('micah')
      // Hacan: arretze(0) + hercant(1) + kamdorn(1) = 2 influence
      expect(micah.getTotalInfluence()).toBe(2)
    })
  })
})
