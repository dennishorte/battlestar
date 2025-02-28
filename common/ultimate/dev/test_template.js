Error.stackTraceLimit = 100
const t = require('../../testutil.js')

describe('{card_name}', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        {card_color}: ['{card_name}'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.{card_name}')

    t.testBoard(game, {
      dennis: {
        {card_color}: ['{card_name}'],
      },
    })
  })

})
