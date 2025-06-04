Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('A.I.', () => {
  test('draw and score', () => {
    const game = t.fixtureTopCard('A.I.')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 10, ['Globalization'])
    })
    let request
    request = game.run()
    request = game.respondToInputRequest({
      actor: 'dennis',
      title: 'Choose First Action',
      selection: [{
        title: 'Dogma',
        selection: ['A.I.']
      }],
    })

    expect(t.cards(game, 'score')).toEqual(['Globalization'])
  })

  test('win condition', () => {
    const game = t.fixtureTopCard('A.I.')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 10, ['Globalization'])
      t.setColor(game, 'dennis', 'blue', ['Software'])
      t.setColor(game, 'micah', 'red', ['Robotics'])
    })
    let request
    request = game.run()
    request = game.respondToInputRequest({
      actor: 'dennis',
      title: 'Choose First Action',
      selection: [{
        title: 'Dogma',
        selection: ['A.I.']
      }],
    })

    t.testGameOver(request, 'micah', 'A.I.')
  })
})
