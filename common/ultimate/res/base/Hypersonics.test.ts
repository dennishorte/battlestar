Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Hypersonics', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Hypersonics'],
      },
      micah: {
        green: ['Classification'],
        yellow: ['Canning'],
        blue: ['Writing', 'Experimentation'],
        red: ['Archery'],
        purple: ['Democracy', 'Reformation'],
        hand: ['Machine Tools', 'Machinery', 'Bicycle'],
        score: ['Industrialization', 'Software', 'Domestication']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Hypersonics')
    request = t.choose(game, request, 6)
    request = t.choose(game, request, 'Democracy', 'Canning')


    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Hypersonics'],
      },
      micah: {
        green: ['Classification'],
        blue: ['Writing', 'Experimentation'],
        red: ['Archery'],
        purple: ['Reformation'],
        hand: ['Bicycle'],
        score: ['Software']
      },
    })
  })

})
