const t = require('../../testutil.js')
const leader = require('./StabanTuek.js')

describe('Staban Tuek', () => {
  test('data', () => {
    expect(leader.name).toBe('Staban Tuek')
    expect(leader.source).toBe('Uprising')
    expect(leader.startingEffect).toContain('Limited Allies')
  })

  describe('Limited Allies', () => {
    test('Diplomacy is removed from starting deck', () => {
      const game = t.fixture()
      t.setBoard(game, { leaders: { dennis: leader } })
      game.run()

      const allDennisCards = [
        ...game.zones.byId('dennis.deck').cardlist(),
        ...game.zones.byId('dennis.hand').cardlist(),
      ]
      expect(allDennisCards.find(c => c.name === 'Diplomacy')).toBeUndefined()
    })

    test('modifyStartingDeck filters out Diplomacy', () => {
      const filtered = leader.modifyStartingDeck(null, null, ['Dagger', 'Diplomacy', 'Dune'])
      expect(filtered).toEqual(['Dagger', 'Dune'])
    })
  })

  describe('Smuggle Spice', () => {
    test('+1 Spice when opponent visits a spied-on Maker space', () => {
      // micah (no agents) → dennis takes a turn first; instead set things up
      // so MICAH is the active player visiting a maker space dennis spies on.
      // Easier path: dennis visits a non-maker space first, ending his agent
      // turn; then micah visits Imperial Basin (maker). But dennis can't
      // easily target Imperial Basin without a yellow agent.
      // Simpler: just have dennis pass with reveal turn and then micah goes
      // to Imperial Basin. But we want micah to visit while dennis spies.
      // Use 0 agents on dennis so micah is the active player from the start
      // of round 1.
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { agents: 0, spice: 0 },
        spyPosts: { D: ['dennis'] }, // Post D covers imperial-basin
      })
      game.run()

      // Dennis has no agent; goes through reveal turn flow. Acquire prompt
      // appears — pass.
      // Reveal turn ends, micah's "Choose Turn" pops up.
      // Acquire prompt has Pass option: 'Acquire cards (5 Persuasion available)'
      // Pass through it
      while (game.waiting?.selectors[0]?.actor === 'dennis') {
        const choices = t.currentChoices(game)
        if (choices.includes('Pass')) {
          t.choose(game, 'Pass')
        }
        else {
          t.choose(game, choices[0])
        }
      }
      // Now micah's turn. Have micah send agent to Imperial Basin (via Dagger
      // which has green icon... no, Dagger is green only). Need a yellow card.
      // Reconnaissance has yellow icon? Let me check default starter hand.
      // Per testutil, starter hand: Dagger(green), Dune(yellow), Diplomacy(faction),
      // CA(-), Reconnaissance(purple). Dune is yellow → can target Imperial Basin.
      t.choose(game, 'Agent Turn.Dune, The Desert Planet')
      t.choose(game, 'Imperial Basin')

      // Dennis (spying) gets +1 Spice from Smuggle Spice
      expect(game.players.byName('dennis').spice).toBe(1)
    })

    test('no spice when not spying on the visited space', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { agents: 0, spice: 0 },
        spyPosts: { A: ['dennis'] }, // Post A: arrakeen / spice-refinery — not Imperial Basin
      })
      game.run()

      while (game.waiting?.selectors[0]?.actor === 'dennis') {
        const choices = t.currentChoices(game)
        if (choices.includes('Pass')) {
          t.choose(game, 'Pass')
        }
        else {
          t.choose(game, choices[0])
        }
      }
      t.choose(game, 'Agent Turn.Dune, The Desert Planet')
      t.choose(game, 'Imperial Basin')

      expect(game.players.byName('dennis').spice).toBe(0)
    })
  })

  describe('Unseen Network', () => {
    function playSignet(game) {
      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Arrakeen')
      t.choose(game, 'Signet Ring')
    }

    function postLabel(postId) {
      const observationPosts = require('../observationPosts.js')
      const boardSpaces = require('../boardSpaces.js')
      const post = observationPosts.find(p => p.id === postId)
      const spaceNames = post.spaces.map(id => {
        const s = boardSpaces.find(s => s.id === id)
        return s ? s.name : id
      })
      return `Post ${postId} (${spaceNames.join(', ')})`
    }

    test('places a spy on chosen post and decrements supply', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { hand: ['Signet Ring'] },
      })
      game.run()

      const supplyBefore = game.players.byName('dennis').spiesInSupply

      playSignet(game)
      // Post D: imperial-basin only (yellow, no green or faction → no bonus)
      t.choose(game, postLabel('D'))

      expect(game.players.byName('dennis').spiesInSupply).toBe(supplyBefore - 1)
      expect(game.state.spyPosts.D).toContain('dennis')
    })

    test('green post bonus: trade 1 Spice for 3 Solari', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 1, solari: 0, hand: ['Signet Ring'] },
      })
      game.run()

      playSignet(game)
      // Post H: high-council, imperial-privilege, sword-master — all green
      t.choose(game, postLabel('H'))
      t.choose(game, 'Trade 1 Spice → 3 Solari')

      expect(game.players.byName('dennis').spice).toBe(0)
      expect(game.players.byName('dennis').solari).toBe(3)
    })

    test('faction post bonus: trade 2 Solari for 1 Intrigue', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { solari: 2, hand: ['Signet Ring'] },
      })
      game.run()

      const intrigueBefore = game.zones.byId('dennis.intrigue').cardlist().length

      playSignet(game)
      // Post J: sardaukar (emperor faction) and dutiful-service (guild faction)
      t.choose(game, postLabel('J'))
      t.choose(game, 'Trade 2 Solari → 1 Intrigue')

      expect(game.players.byName('dennis').solari).toBe(0)
      expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(intrigueBefore + 1)
    })

    test('no-op when no spies in supply', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spiesInSupply: 0, hand: ['Signet Ring'] },
      })
      game.run()

      playSignet(game)
      // Signet ring resolved with no post placement; agent turn proceeds
      // straight to deploy.
      expect(game.waiting?.selectors[0].title).not.toContain('Unseen Network')
      expect(game.players.byName('dennis').spiesInSupply).toBe(0)
    })

    test('green bonus not offered without Spice', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 0, solari: 0, hand: ['Signet Ring'] },
      })
      game.run()

      playSignet(game)
      t.choose(game, postLabel('H'))
      // No green-bonus prompt — agent turn proceeds.
      expect(game.waiting?.selectors[0].title).not.toContain('Green bonus')
      expect(game.players.byName('dennis').solari).toBe(0)
    })
  })
})
