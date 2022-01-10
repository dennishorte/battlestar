Error.stackTraceLimit = 100

const t = require('../testutil.js')

describe('initial number of actions', () => {
  test('first player gets one action in two players', () => {
    const game = t.fixtureFirstPicks({ numPlayers: 2 })
    expect(game.getPlayerAll().length).toBe(2)
    t.meld(game, 'Writing')
    expect(game.getPlayerCurrentTurn().name).toBe('dennis')
  })

  test('first player gets one action in three players', () => {
    const game = t.fixtureFirstPicks({ numPlayers: 3 })
    expect(game.getPlayerAll().length).toBe(3)
    t.meld(game, 'Writing')
    expect(game.getPlayerCurrentTurn().name).toBe('tom')
    expect(game.getWaiting('tom').name).toBe('Action (1 of 2)')
  })

  test('second player gets one action in four players', () => {
    const game = t.fixtureFirstPicks({ numPlayers: 4 })
    expect(game.getPlayerAll().length).toBe(4)
    expect(game.getWaiting('micah')).toBeDefined()
    t.meld(game, 'Writing')
    expect(game.getPlayerCurrentTurn().name).toBe('tom')
    expect(game.getWaiting('tom').name).toBe('Action (1 of 1)')
    t.meld(game, 'Code of Laws')
    expect(game.getPlayerCurrentTurn().name).toBe('eliya')
    expect(game.getWaiting('eliya').name).toBe('Action (1 of 2)')
  })
})

describe('free artifact action', () => {
  function _artifactFixture() {
    const game = t.fixtureFirstPicks({
      expansions: ['base', 'arti'],
    })
    game.rk.undo('Player Turn')
    t.setArtifact(game, 'micah', 'Holmegaard Bows')
    game.run()
    return game
  }

  test('is available if an artifact is on display', () => {
    const game = _artifactFixture()
    expect(game.getWaiting('micah').name).toBe('Artifact on Display')
  })

  test('can do the artifact dogma', () => {
    const game = _artifactFixture()
    expect(t.getOptionKind(game, 'dogma-artifact')).toBeDefined()
  })

  test('can return the artifact', () => {
    const game = _artifactFixture()
    expect(t.getOptionKind(game, 'return-artifact')).toBeDefined()
  })

  test('can do nothing', () => {
    const game = _artifactFixture()
    expect(t.getOptionKind(game, 'do nothing')).toBeDefined()
  })
})

test('action 1', () => {

})

test('action 2', () => {

})

test('game advances to next player after all actions complete', () => {

})

describe('decree actions', () => {
  describe('decrees from cards in hand', () => {
    test('three figures: no decree if same age', () => {
      const game = t.fixtureFirstPicks({ expansions: ['base', 'figs'] })
      t.setHand(game, 'micah', ['Homer', 'Sinuhe', 'Ptolemy'])
      game.run()
      expect(game.getWaiting('micah').options).toEqual(expect.not.arrayContaining([
        expect.objectContaining({
          name: 'Decree',
        })
      ]))
    })

    test('three figures: different ages', () => {
      const game = t.fixtureFirstPicks({ expansions: ['base', 'figs'] })
      t.setHand(game, 'micah', ['Homer', 'Ptolemy', 'Al-Kindi'])
      game.run()
      expect(game.getWaiting('micah').options).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'Decree',
          options: ['Rivalry', 'Trade']
        })
      ]))
    })

    test('decrees from five leaders', () => {
      const game = t.fixtureFirstPicks({ expansions: ['base', 'figs'] })
      t.setHand(game, 'micah', ['Homer', 'Ptolemy', 'Yi Sun-Sin', 'Daedalus', 'Shennong'])
      game.run()
      expect(game.getWaiting('micah').options).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'Decree',
          options: ['Advancement', 'Expansion', 'Rivalry', 'Trade', 'War']
        })
      ]))
    })
  })

  describe('decrees from karma', () => {
    test('player has two figures in hand', () => {
      const game = t.fixtureFirstPicks({ expansions: ['base', 'figs'] })
      t.setColor(game, 'micah', 'purple', ['Sinuhe'])
      t.setHand(game, 'micah', ['Homer', 'Fu Xi'])
      game.run()
      expect(game.getWaiting('micah').options).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'Decree',
          options: ['Rivalry']
        })
      ]))
    })

    test('player does not have two figures in hand', () => {
      const game = t.fixtureFirstPicks({ expansions: ['base', 'figs'] })
      t.setColor(game, 'micah', 'purple', ['Sinuhe'])
      t.setHand(game, 'micah', ['Homer', 'Mathematics'])
      game.run()
      expect(game.getWaiting('micah').options).toEqual(expect.not.arrayContaining([
        expect.objectContaining({
          name: 'Decree',
        })
      ]))
    })
  })
})
