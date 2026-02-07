const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Game Trade (D009)', () => {
  test('gives boar and cattle', () => {
    const card = res.getCardById('game-trade-d009')
    const game = t.fixture({ cardSets: ['minorD'] })
    game.run()

    const dennis = t.player(game)
    dennis.animals = { sheep: 0, boar: 0, cattle: 0 }
    dennis.addAnimal = (type, count) => {
      dennis.animals[type] += count
    }

    card.onPlay(game, dennis)

    expect(dennis.animals.boar).toBe(1)
    expect(dennis.animals.cattle).toBe(1)
  })
})
