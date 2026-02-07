const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Junk Room (A055)', () => {
  test('gives 1 food on play', () => {
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        wood: 1,
        clay: 1,
        food: 0,
        hand: ['junk-room-a055'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'junk-room-a055')

    const dennis = t.player(game)
    // Gets 1 food from onPlay
    expect(dennis.food).toBe(1)
  })

  test('onBuildImprovement gives 1 food', () => {
    const card = res.getCardById('junk-room-a055')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()
    const dennis = t.player(game)
    dennis.food = 0

    card.onBuildImprovement(game, dennis)
    expect(dennis.food).toBe(1)

    card.onBuildImprovement(game, dennis)
    expect(dennis.food).toBe(2)
  })
})
