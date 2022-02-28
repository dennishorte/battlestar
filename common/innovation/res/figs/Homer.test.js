const t = require('../../testutil.js')

describe('Homer', () => {

  test('inspire', () => {
    const game = t.fixtureTopCard('Homer', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Tools'])
      t.setDeckTop(game, 'base', 2, ['Mathematics'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.purple')
    expect(t.cards(game, 'blue')).toStrictEqual(['Tools', 'Mathematics'])
  })

  test('karma: remove', () => {
    const game = t.fixtureDecrees()
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'purple', ['Homer'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Decree.Trade')
    const result3 = t.choose(game, result2, 'auto')

    expect(t.cards(game, 'red')).toStrictEqual(['Yi Sun-Sin'])
    expect(t.cards(game, 'yellow')).toStrictEqual(['Ximen Bao'])
    expect(t.cards(game, 'green')).toStrictEqual(['Ptolemy'])
    expect(t.cards(game, 'blue')).toStrictEqual(['Daedalus'])
  })

  test('karma: return', () => {
    const game = t.fixtureTopCard('Agriculture', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'purple', ['Homer'])
      t.setHand(game, 'dennis', ['Fu Xi'])
      t.setDeckTop(game, 'base', 2, ['Mathematics'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Agriculture')
    const result3 = t.choose(game, result2, 'Fu Xi')

    expect(t.cards(game, 'green')).toStrictEqual(['Fu Xi'])
    expect(t.cards(game, 'blue')).toStrictEqual([])
  })

  test('karma: return from score does not trigger', () => {
    const game = t.fixtureTopCard('Printing Press', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'purple', ['Homer'])
      t.setScore(game, 'dennis', ['Fu Xi'])
      t.setDeckTop(game, 'base', 3, ['Paper'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Printing Press')
    const result3 = t.choose(game, result2, 'Fu Xi')

    expect(t.cards(game, 'green')).toStrictEqual([])
    expect(t.cards(game, 'score')).toStrictEqual([])
    const FuXi = game.getCardByName('Fu Xi')
    expect(FuXi.zone).toBe('decks.figs.1')
  })

})
