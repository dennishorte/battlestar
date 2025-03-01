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
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Mapmaking')

    expect(t.cards(game, 'score').sort()).toStrictEqual(['Mysticism', 'The Wheel'])
  })

  test('if a card was not transferred', () => {
    const game = t.fixtureTopCard('Mapmaking', { numPlayers: 3 })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.clearBoard(game, 'micah')
      t.clearBoard(game, 'scott')
      t.setScore(game, 'micah', ['Mathematics'])
      t.setScore(game, 'scott', ['Navigation'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Mapmaking')

    expect(t.cards(game, 'score').sort()).toStrictEqual([])
  })
})
