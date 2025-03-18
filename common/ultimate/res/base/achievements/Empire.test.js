Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Empire Achievement', () => {
  test('achieved', () => {
    const game = t.fixtureFirstPlayer()
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Databases'])
      t.setColor(game, 'dennis', 'yellow', [])
      t.setColor(game, 'dennis', 'red', ['Coal'])
      t.setColor(game, 'dennis', 'blue', ['Philosophy'])
      t.setColor(game, 'dennis', 'purple', ['Reformation'])
      t.setColor(game, 'dennis', 'green', ['The Wheel', 'Navigation'])
      t.setSplay(game, 'dennis', 'green', 'up')
    })

    let request
    request = game.run()
    const biscuits = game.getBiscuitsByPlayer(t.dennis(game))
    expect(biscuits.c).toBe(3)
    expect(biscuits.f).toBe(3)
    expect(biscuits.k).toBe(3)
    expect(biscuits.l).toBe(3)
    expect(biscuits.s).toBe(3)
    expect(biscuits.i).toBe(0)

    request = t.choose(game, request, 'Meld.Databases')

    expect(t.cards(game, 'achievements')).toStrictEqual(['Empire'])
  })

  test('person biscuits do not count', () => {
    const game = t.fixtureFirstPlayer()
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Escapism'])
      t.setColor(game, 'dennis', 'yellow', [])
      t.setColor(game, 'dennis', 'red', ['Coal'])
      t.setColor(game, 'dennis', 'blue', ['Philosophy'])
      t.setColor(game, 'dennis', 'purple', ['Reformation'])
      t.setColor(game, 'dennis', 'green', ['The Wheel', 'Navigation'])
      t.setSplay(game, 'dennis', 'green', 'up')
    })

    let request
    request = game.run()
    const biscuits = game.getBiscuitsByPlayer(t.dennis(game))
    expect(biscuits.c).toBe(3)
    expect(biscuits.f).toBe(3)
    expect(biscuits.k).toBe(3)
    expect(biscuits.l).toBe(3)
    expect(biscuits.s).toBe(3)
    expect(biscuits.i).toBe(0)

    request = t.choose(game, request, 'Meld.Escapism')

    expect(t.cards(game, 'achievements')).toStrictEqual([])
  })

  test('not quite', () => {
    const game = t.fixtureFirstPlayer()
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Bioengineering'])
      t.setColor(game, 'dennis', 'yellow', [])
      t.setColor(game, 'dennis', 'red', ['Coal'])
      t.setColor(game, 'dennis', 'blue', ['Philosophy'])
      t.setColor(game, 'dennis', 'purple', ['Reformation'])
      t.setColor(game, 'dennis', 'green', ['The Wheel', 'Navigation'])
      t.setSplay(game, 'dennis', 'green', 'up')
    })

    let request
    request = game.run()
    const biscuits = game.getBiscuitsByPlayer(t.dennis(game))
    expect(biscuits.c).toBe(3)
    expect(biscuits.f).toBe(3)
    expect(biscuits.k).toBe(3)
    expect(biscuits.l).toBe(3)
    expect(biscuits.s).toBe(3)
    expect(biscuits.i).toBe(0)

    request = t.choose(game, request, 'Meld.Bioengineering')

    expect(t.cards(game, 'achievements')).toStrictEqual([])
  })
})
