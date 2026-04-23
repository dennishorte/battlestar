const t = require('../../testutil.js')
const factions = require('../../systems/factions.js')
const leader = require('./LadyMargotFenring.js')

describe('Lady Margot Fenring', () => {
  test('data', () => {
    expect(leader.name).toBe('Lady Margot Fenring')
    expect(leader.source).toBe('Uprising')
  })

  describe('Loyalty', () => {
    test('fires when crossing 1 → 2 BG influence', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { influence: { 'bene-gesserit': 1 }, spice: 0 },
      })
      game.run()

      factions.gainInfluence(game, game.players.byName('dennis'), 'bene-gesserit')
      expect(game.players.byName('dennis').spice).toBe(2)
    })

    test('fires on multi-step gain crossing 2 (0 → 3)', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { influence: { 'bene-gesserit': 0 }, spice: 0 },
      })
      game.run()

      factions.gainInfluence(game, game.players.byName('dennis'), 'bene-gesserit', 3)
      expect(game.players.byName('dennis').spice).toBe(2)
    })

    test('does not fire on 2 → 3 (already at/above threshold)', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { influence: { 'bene-gesserit': 2 }, spice: 0 },
      })
      game.run()

      factions.gainInfluence(game, game.players.byName('dennis'), 'bene-gesserit')
      expect(game.players.byName('dennis').spice).toBe(0)
    })

    test('re-fires after dropping below 2 and regaining (rules.txt)', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { influence: { 'bene-gesserit': 1 }, spice: 0 },
      })
      game.run()

      factions.gainInfluence(game, game.players.byName('dennis'), 'bene-gesserit')
      factions.loseInfluence(game, game.players.byName('dennis'), 'bene-gesserit', 2)
      factions.gainInfluence(game, game.players.byName('dennis'), 'bene-gesserit', 2)
      expect(game.players.byName('dennis').spice).toBe(4)
    })

    test('does not fire for non-BG factions', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { influence: { emperor: 1, guild: 1, fremen: 1 }, spice: 0 },
      })
      game.run()

      factions.gainInfluence(game, game.players.byName('dennis'), 'emperor')
      factions.gainInfluence(game, game.players.byName('dennis'), 'guild')
      factions.gainInfluence(game, game.players.byName('dennis'), 'fremen')
      // emperor/guild/fremen reach-2 bonuses include their own resource grants;
      // compare against a fresh game without the leader to isolate Loyalty.
      const baseline = t.fixture()
      t.setBoard(baseline, {
        dennis: { influence: { emperor: 1, guild: 1, fremen: 1 }, spice: 0 },
      })
      baseline.run()
      factions.gainInfluence(baseline, baseline.players.byName('dennis'), 'emperor')
      factions.gainInfluence(baseline, baseline.players.byName('dennis'), 'guild')
      factions.gainInfluence(baseline, baseline.players.byName('dennis'), 'fremen')

      expect(game.players.byName('dennis').spice).toBe(baseline.players.byName('dennis').spice)
    })
  })

  describe('Arrakis Informant', () => {
    test('places spy on a purple-adjacent post and decrements supply', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { hand: ['Signet Ring'] },
      })
      game.run()

      const startSpies = game.players.byName('dennis').spiesInSupply

      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Arrakeen')
      t.choose(game, 'Signet Ring')
      // Multiple purple-adjacent posts; pick the first.
      const choices = t.currentChoices(game)
      const postChoice = choices.find(c => c.startsWith('Post '))
      expect(postChoice).toBeDefined()
      t.choose(game, postChoice)

      expect(game.players.byName('dennis').spiesInSupply).toBe(startSpies - 1)
    })

    test('no-op when no spies in supply', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spiesInSupply: 0, hand: ['Signet Ring'] },
      })
      game.run()

      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Arrakeen')
      t.choose(game, 'Signet Ring')

      // No post-selection prompt — agent turn proceeds.
      expect(game.waiting?.selectors[0].title).not.toContain('Arrakis Informant')
      expect(game.players.byName('dennis').spiesInSupply).toBe(0)
    })
  })
})
