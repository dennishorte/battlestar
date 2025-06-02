const t = require('../../testutil.js')

describe('Mapmaking', () => {
  test('demand', () => {
    const game = t.fixtureTopCard('Mapmaking', { numPlayers: 3 })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.clearBoard(game, 'micah')
      t.clearBoard(game, 'scott')
      t.setScore(game, 'micah', ['The Wheel', 'Mathematics'])
      t.setScore(game, 'scott', ['Navigation'])
      t.setDeckTop(game, 'base', 1, ['Mysticism'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Mapmaking')

    expect(t.cards(game, 'score').sort()).toEqual(['Mysticism', 'The Wheel'])
  })

  test('if a card was not transferred', () => {
    const game = t.fixtureTopCard('Mapmaking', { numPlayers: 3 })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.clearBoard(game, 'micah')
      t.clearBoard(game, 'scott')
      t.setScore(game, 'micah', ['Mathematics'])
      t.setScore(game, 'scott', ['Navigation'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Mapmaking')

    expect(t.cards(game, 'score').sort()).toEqual([])
  })
})
