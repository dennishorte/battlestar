Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Agriculture', () => {
  test('return a card', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Agriculture'],
        hand: ['Domestication'],
      },
    })

    let request = game.run()
    request = t.choose(game, request, 'Dogma.Agriculture')
    t.choose(game, request, 'Domestication')

    const dennis = game.players.byName('dennis')
    expect(game.getScore(dennis)).toBe(2)
  })

  test('do not return a card', () => {
    const game = t.fixtureTopCard('Agriculture')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Domestication'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Agriculture')
    t.choose(game, request)

    const dennis = game.players.byName('dennis')
    expect(game.getScore(dennis)).toBe(0)
  })
})
