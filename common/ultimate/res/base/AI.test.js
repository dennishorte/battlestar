Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('A.I.', () => {
  test('draw and score', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['A.I.'],
      },
      decks: {
        base: {
          10: ['Globalization'],
        },
      },
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
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['A.I.'],
        blue: ['Software'],
      },
      micah: {
        red: ['Robotics'],
      },
      decks: {
        base: {
          10: ['Globalization'],
        },
      },
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
