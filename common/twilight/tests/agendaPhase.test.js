const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

// Run through a full round (strategy + action + status) to reach agenda phase
function playToAgenda(game, opts = {}) {
  pickStrategyCards(game, opts.dennisCard || 'leadership', opts.micahCard || 'diplomacy')
  // Both use strategy cards then pass
  t.choose(game, 'Strategic Action')
  t.choose(game, 'Strategic Action')
  t.choose(game, 'Pass')
  t.choose(game, 'Pass')
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
      })
      game.run()

      // Play a full round
      playToAgenda(game)

      // After status phase, agenda phase should be waiting
      // Check what the game is waiting for
      const waiting = game.waiting.selectors[0]
      expect(waiting.title).toContain('Agenda')
      expect(game.state.phase).toBe('agenda')
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
