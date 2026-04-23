const t = require('../../testutil.js')
const leader = require('./FeydRauthaHarkonnen.js')

describe('Feyd-Rautha Harkonnen', () => {
  test('data', () => {
    expect(leader.name).toBe('Feyd-Rautha Harkonnen')
    expect(leader.source).toBe('Uprising')
  })

  test('onAssign initializes feydTrack at start', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()
    expect(game.state.feydTrack.dennis).toBe('start')
  })

  describe('Devious Strength', () => {
    test('no spy: Devious Strength does not prompt at reveal', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { agents: 0 },
      })
      game.run()
      expect(game.waiting?.selectors[0].title).not.toContain('Devious Strength')
    })

    test('Pass leaves spy in place and strength unchanged', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { agents: 0 },
        spyPosts: { A: ['dennis'] },
      })
      game.run()

      t.choose(game, 'Pass')
      expect(game.state.spyPosts.A).toContain('dennis')
      expect(game.players.byName('dennis').getCounter('strength')).toBe(0)
    })

    test('Recall: +2 Strength preserved alongside troop and sword strength', () => {
      // 1 troop (2) + 1 sword from Dagger (1) + Devious Strength (2) = 5 final
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { agents: 0 },
        spyPosts: { A: ['dennis'] },
        conflict: { deployedTroops: { dennis: 1 } },
      })
      game.run()

      const suppliesBefore = game.players.byName('dennis').spiesInSupply
      t.choose(game, 'Recall a Spy for +2 Strength')
      expect(game.players.byName('dennis').spiesInSupply).toBe(suppliesBefore + 1)
      expect(game.state.spyPosts.A || []).not.toContain('dennis')
      expect(game.players.byName('dennis').getCounter('strength')).toBe(5)
    })
  })

  describe('Personal Training', () => {
    function playSignet(game) {
      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Arrakeen')
      t.choose(game, 'Signet Ring')
    }

    test('moving from start chooses path A (pay-solari-trash)', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { solari: 0, hand: ['Signet Ring'] }, // 0 solari → no trash sub-prompt
      })
      game.run()

      playSignet(game)
      t.choose(game, 'A: Pay 1 Solari to trash a card')
      expect(game.state.feydTrack.dennis).toBe('A')
    })

    test('moving to finish grants troop-spy reward', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { hand: ['Signet Ring'] },
        feydTrack: { dennis: 'D' }, // D → finish (single edge, auto-resolves)
      })
      game.run()

      const garrisonBefore = game.players.byName('dennis').troopsInGarrison

      playSignet(game)
      // After D → finish, troop is added then placeSpy prompts for a post.
      // Pick the first available post.
      const spyPrompt = t.currentChoices(game)
      const postChoice = spyPrompt.find(c => c.startsWith('Post '))
      expect(postChoice).toBeDefined()
      t.choose(game, postChoice)

      expect(game.state.feydTrack.dennis).toBe('finish')
      // Arrakeen also gives +1 troop, so garrison gain is 2.
      expect(game.players.byName('dennis').troopsInGarrison).toBe(garrisonBefore + 2)
    })

    test('no-op when already at finish', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { hand: ['Signet Ring'] },
        feydTrack: { dennis: 'finish' },
      })
      game.run()

      playSignet(game)
      // No track-related prompts; agent turn proceeds to deploy.
      expect(game.waiting?.selectors[0].title).not.toContain('Feyd Training')
      expect(game.state.feydTrack.dennis).toBe('finish')
    })
  })
})
