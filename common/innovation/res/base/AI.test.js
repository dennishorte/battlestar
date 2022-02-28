Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('A.I.', () => {
  test('draw and score', () => {
    const game = t.fixtureTopCard('A.I.')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 10, ['Globalization'])
    })
    const result1 = game.run()
    const result2 = game.respondToInputRequest({
      actor: 'dennis',
      title: 'Choose First Action',
      selection: [{
        name: 'Dogma',
        selection: ['A.I.']
      }],
      key: result1.key
    })

    expect(t.cards(game, 'score')).toStrictEqual(['Globalization'])
  })

  test('win condition', () => {
    const game = t.fixtureTopCard('A.I.')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 10, ['Globalization'])
      t.setColor(game, 'dennis', 'blue', ['Software'])
      t.setColor(game, 'micah', 'red', ['Robotics'])
    })
    const result1 = game.run()
    const result2 = game.respondToInputRequest({
      actor: 'dennis',
      title: 'Choose First Action',
      selection: [{
        name: 'Dogma',
        selection: ['A.I.']
      }],
      key: result1.key
    })

    expect(result2).toEqual(expect.objectContaining({
      data: expect.objectContaining({
        player: expect.objectContaining({ name: 'micah' }),
        reason: 'A.I.'
      })
    }))
  })
})
