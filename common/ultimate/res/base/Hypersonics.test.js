Error.stackTraceLimit = 100

const t = require('../../testutil.js')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Hypersonics')
    const request3 = t.choose(game, request2, 6)
    const request4 = t.choose(game, request3, 'Democracy', 'Canning')


    t.testIsSecondPlayer(request4)
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
